import { Author } from '../../models/author.js';

import * as express from 'express';

export const getAuthorbyID = (req:express.Request, res:express.Response, next:express.NextFunction)=>{
    const authorID = req.params.id;
    Author.findById(authorID)
            .then(doc=>{
                if(doc){
                    res.status(200).json({
                        author: doc
                    });
                }
                else{
                    res.status(200).json({
                        author:null
                    });
                }
            })
            .catch(err=>console.log(err));

};

export const getAuthors = (req:express.Request, res:express.Response, next:express.NextFunction)=>{
    Author.find({}).then(docs=>{
        res.status(200).json({
            authors:docs
        });
    })
    .catch(err=>console.log(err));
};