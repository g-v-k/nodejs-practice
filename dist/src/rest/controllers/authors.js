"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthors = exports.getAuthorbyID = void 0;
const author_js_1 = require("../../models/author.js");
exports.getAuthorbyID = (req, res, next) => {
    const authorID = req.params.id;
    author_js_1.Author.findById(authorID)
        .then(doc => {
        if (doc) {
            res.status(200).json({
                author: doc
            });
        }
        else {
            res.status(200).json({
                author: null
            });
        }
    })
        .catch(err => console.log(err));
};
exports.getAuthors = (req, res, next) => {
    author_js_1.Author.find({}).then(docs => {
        res.status(200).json({
            authors: docs
        });
    })
        .catch(err => console.log(err));
};
