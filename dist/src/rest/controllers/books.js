"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooks = exports.getBookByID = void 0;
const book_js_1 = require("../../models/book.js");
exports.getBookByID = (req, res, next) => {
    book_js_1.Book.findById(req.params.id)
        .then(doc => {
        if (doc) {
            res.status(200).json({
                book: doc
            });
        }
        else {
            res.status(404).json({
                book: null
            });
        }
    })
        .catch(err => console.log(err));
};
exports.getBooks = (req, res, next) => {
    book_js_1.Book.find({}).then(docs => {
        res.status(200).json({
            books: docs
        });
    })
        .catch(err => console.log(err));
};
