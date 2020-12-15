import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLSchema, GraphQLScalarType } from 'graphql';
import { Book } from '../models/book';
import { Author } from '../models/author';


const BookType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author:{
            type:AuthorType,
            resolve(parent, args){
                return Author.findById(parent.authorID);
            }
        }
    })
});

const AuthorType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age:{type:GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){ 
                return Book.find({authorID:parent._id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return Book.findById(args.id);
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLString}},
            resolve(parent, args){
                return Author.findById(args.id);
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent, args){
               return Book.find({});
            }
        },
        authors:{
            type:new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)},
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new Author({
                    _id:args.id,
                    name:args.name,  
                    age:args.age
                });
                return author.save();
            }
        },
        addBook:{
            type:BookType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)},
                name:{type:new GraphQLNonNull(GraphQLString)},
                authorID:{type:new GraphQLNonNull(GraphQLString)},
                genre:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let book = new Book({
                    _id:args.id,
                    name:args.name,
                    authorID:args.authorID,
                    genre:args.genre
                });
                return book.save();
            }
        },
        deleteBook:{
            type:BookType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return Book.findByIdAndDelete(args.id);
            }
        },
        deleteAuthor:{
            type:AuthorType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return Author.findByIdAndDelete(args.id);
            }
        }
    }
});

export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});


