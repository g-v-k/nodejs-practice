import * as express from 'express';

export const postFileUpload = (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    res.status(200).json({
        dataUpload:'done'
    });
};

export const getFile = (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    res.sendFile('/home/vamsi/Downloads/nodejs-practice/images/video.avi');
};