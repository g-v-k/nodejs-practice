import { Book } from '../../models/book.js';
import * as express from 'express';

export const getBookByID = (req:express.Request,res:express.Response, next:express.NextFunction)=>{
    Book.findById(req.params.id)
        .then(doc=>{
            if(doc){
                res.status(200).json({
                    book:doc
                });
            }else{
                res.status(404).json({
                    book:null
                });
            }
        })
        .catch(err=>console.log(err));
};

export const getBooks = (req:express.Request,res:express.Response, next:express.NextFunction)=>{
    Book.find({}).then(docs=>{
        res.status(200).json({
            books:docs
        });
    })
    .catch(err=>console.log(err));

}