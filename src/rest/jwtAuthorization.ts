import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {

    const token = req.get('Authorization');
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    let body;
    try {
        body = jwt.verify(token!,'vamsivamsivamsi');
    } catch (err) {
        return res.status(401).json({
            message: "incorrect jwt"
        });
    }
    if (!body) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    (req as any).userID = (body as any).userID;
    next(); 
};