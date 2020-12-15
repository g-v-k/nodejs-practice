"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const book_1 = require("../models/book");
const author_1 = require("../models/author");
const BookType = new graphql_1.GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        genre: { type: graphql_1.GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return author_1.Author.findById(parent.authorID);
            }
        }
    })
});
const AuthorType = new graphql_1.GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLInt },
        books: {
            type: new graphql_1.GraphQLList(BookType),
            resolve(parent, args) {
                return book_1.Book.find({ authorID: parent._id });
            }
        }
    })
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return book_1.Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return author_1.Author.findById(args.id);
            }
        },
        books: {
            type: new graphql_1.GraphQLList(BookType),
            resolve(parent, args) {
                return book_1.Book.find({});
            }
        },
        authors: {
            type: new graphql_1.GraphQLList(AuthorType),
            resolve(parent, args) {
                return author_1.Author.find({});
            }
        }
    }
});
const Mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                age: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new author_1.Author({
                    _id: args.id,
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                authorID: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                genre: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
            },
            resolve(parent, args) {
                let book = new book_1.Book({
                    _id: args.id,
                    name: args.name,
                    authorID: args.authorID,
                    genre: args.genre
                });
                return book.save();
            }
        },
        deleteBook: {
            type: BookType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
            },
            resolve(parent, args) {
                return book_1.Book.findByIdAndDelete(args.id);
            }
        },
        deleteAuthor: {
            type: AuthorType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
            },
            resolve(parent, args) {
                return author_1.Author.findByIdAndDelete(args.id);
            }
        }
    }
});
exports.schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
