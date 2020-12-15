"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSignup = exports.usernameCheck = exports.logout = exports.login = void 0;
const crypto = __importStar(require("crypto"));
const user_js_1 = require("../../models/user.js");
const hashIt = (inputString, padding) => {
    let extra = padding ? new Date().toISOString() : '';
    let hashedString = inputString;
    for (let i = 0; i < 2; i++) {
        hashedString = crypto.createHash('sha256').update(hashedString + extra).digest('base64');
    }
    return hashedString;
};
const isPasswordValid = (imputString, password) => {
    const hashedInput = hashIt(imputString, false);
    if (hashedInput === password) {
        return true;
    }
    return false;
};
const isUsernameAvailable = async (username) => {
    const user = await user_js_1.User.findOne({ username: username });
    if (user) {
        return false;
    }
    else {
        return true;
    }
};
exports.login = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    user_js_1.User.findOne({ username: username })
        .then(user => {
        if (user) {
            if (isPasswordValid(password, user.password)) {
                req.session.user = user;
                req.session.isLoggedIn = true;
                req.session.save(err => console.log(err));
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
exports.logout = (req, res, next) => {
    req.session.destroy(err => console.log(err));
    res.status(200).json({
        message: "logged out"
    });
};
exports.usernameCheck = (req, res, next) => {
    const username = req.body.username.trim();
    isUsernameAvailable(username)
        .then(isAvailable => {
        return res.json({ message: isAvailable });
    });
};
exports.postSignup = async (req, res, next) => {
    const username = req.body.username.trim();
    const password = req.body.password;
    const proceed = await isUsernameAvailable(username);
    if (!proceed) {
        return res.json({
            message: 'Username not available'
        });
    }
    if (req.session.user) {
        return res.json({
            message: "You are already logged in. Please logout to sign up for a new account."
        });
    }
    new user_js_1.User({
        _id: hashIt(username, true),
        username: username,
        password: hashIt(password, false)
    })
        .save()
        .then(user => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save(err => console.log(err));
        return res.status(201).json({
            message: "User created"
        });
    })
        .catch(err => res.status(500).json({
        message: "Please try again"
    }));
};
