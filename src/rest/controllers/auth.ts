import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

import { User } from '../../models/user.js';

const hashIt = (inputString: any, padding: boolean) => {

    let extra = padding ? new Date().toISOString() : '';
    let hashedString = inputString;
    for (let i = 0; i < 2; i++) {
        hashedString = crypto.createHash('sha256').update(hashedString + extra).digest('base64');
    }
    return hashedString;
};
const isPasswordValid = (imputString: any, password: String) => {
    const hashedInput = hashIt(imputString, false);
    if (hashedInput === password) {
        return true;
    }
    return false;
};

const isUsernameAvailable = async (username: String) => {
    const user = await User.findOne({ username: username });
    if (user) {
        return false;
    } else {
        return true;
    }
}

export const login = (req: Request, res: Response, next: NextFunction) => {

    
    /* // For sessions
    if(req.session!.isLoggedIn){
        res.status(200).json({
            message:"Already logged in."
        });
    } */
   

    const username = req.body.username;
    const password = req.body.password;


    User.findOne({ username: username })
        .then(user => {
            if (user) {
                if (isPasswordValid(password, (user as any).password)) {
                    /* const token = jwt.sign({
                        userID: user._id
                    }, 'vamsivamsivamsi'); */
                    req.session!.user = user;
                    req.session!.isLoggedIn = true;
                    req.session!.save(err => console.log(err));

                    return res.status(201).json({
                        message: "loggedIn"
                    });
                }
                else {
                    return res.status(401).json({
                        message: "Incorrect username or password"
                    });
                }
            }
            else {
                return res.status(401).json({
                    message: 'Incorrect username or password'
                });
            }
        })
        .catch(err => {

            return res.status(500).json({
                message: 'Please try again'
            });
        });


};

export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.session!.destroy(err => console.log(err));
    res.status(200).json({
        message: "logged out"
    });
};

export const usernameCheck = (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username.trim();
    isUsernameAvailable(username)
        .then(isAvailable => {
            return res.json({ message: isAvailable });
        });

};

export const postSignup = async (req: Request, res: Response, next: NextFunction) => {

    const username = req.body.username.trim();
    const password = req.body.password;

    const proceed: boolean = await isUsernameAvailable(username);
    if (!proceed) {
        return res.json({
            message: 'Username not available'
        });
    }

    if(req.session!.user){
        return res.json({
            message:"You are already logged in. Please logout to sign up for a new account."
        })
    }

    new User({
        _id: hashIt(username, true),
        username: username,
        password: hashIt(password, false)
    })
        .save()
        .then(user => {
            /* const token = jwt.sign({
                userID: user._id
            }, 'vamsivamsivamsi'); */

            req.session!.user = user;
            req.session!.isLoggedIn = true;
            req.session!.save(err => console.log(err));

            return res.status(201).json({
                message: "User created"
            });

            /* return res.status(201).json({
                token: token,
                message: "User Created"
            }); */
        })
        .catch(err => res.status(500).json({
            message: "Please try again"
        }));
};