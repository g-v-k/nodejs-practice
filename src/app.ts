import express from 'express';
import { graphqlHTTP } from 'express-graphql';

import mongoose from 'mongoose';
import path from 'path';

import * as bodyParser from 'body-parser';
import multer from 'multer';
import session from 'express-session';
import connectMongoSession from 'connect-mongodb-session';


import { schema } from './graphql-schemas/schemas.js';

import { bookRoutes } from './rest/routes/books.js'
import { authorRoutes } from './rest/routes/authors.js';
import { fileTransferRoutes } from './rest/routes/fileTransfer.js';
import { authRoutes } from './rest/routes/auth.js';
import { isAuthorized } from './rest/jwtAuthorization.js';
import { User } from './models/user.js';


console.log("hi");
//I am a worker instance
const MongoDBSessionStore = connectMongoSession(session);

export const app = express();

const sessionStore = new MongoDBSessionStore({
    uri: 'mongodb://localhost:27017/books-and-authors',
    collection: 'sessions'
});

//configuring multer for storage and filename
const multerConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/home/vamsi');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});


//filtering mime types in multer
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else cb(null, false);
};

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
// bodyparser for application/json data
app.use(bodyParser.json());

//using sessions for authorization and authentication
app.use(session({
    secret: 'vamsivamsivamsi',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

//for signing up
app.use('', authRoutes);

app.use((req, res, next) => {
    if (req.session!.isLoggedIn) {
        User.findById(req.session!.user._id)
            .then(user => {
                (req as any).user = user;
            })
            .catch(err => console.log(err));
        return next();
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
});

// jwt authorization
//app.use(isAuthorized);

// multer for multipart/form-data
app.use(multer({ storage: multerConfig, fileFilter: fileFilter }).single('image'));

// for graphql queries
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));


// for serving static images
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// for serving JSON data (RESTful)
app.use('/book', bookRoutes);
app.use('/author', authorRoutes);
app.use('/file', fileTransferRoutes);


//connect to local mongodb
mongoose.connect('mongodb://localhost:27017/books-and-authors')
    .then(result => {
        app.listen(3000, () => {
            console.log('Now listening on 3000');
        })
    })
    .catch(err => console.log("not connected"));

