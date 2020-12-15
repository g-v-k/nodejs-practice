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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const bodyParser = __importStar(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const schemas_js_1 = require("./graphql-schemas/schemas.js");
const books_js_1 = require("./rest/routes/books.js");
const authors_js_1 = require("./rest/routes/authors.js");
const fileTransfer_js_1 = require("./rest/routes/fileTransfer.js");
const auth_js_1 = require("./rest/routes/auth.js");
const user_js_1 = require("./models/user.js");
console.log("hi");
const MongoDBSessionStore = connect_mongodb_session_1.default(express_session_1.default);
exports.app = express_1.default();
const sessionStore = new MongoDBSessionStore({
    uri: 'mongodb://localhost:27017/books-and-authors',
    collection: 'sessions'
});
const multerConfig = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/home/vamsi');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else
        cb(null, false);
};
exports.app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
exports.app.use(bodyParser.json());
exports.app.use(express_session_1.default({
    secret: 'vamsivamsivamsi',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));
exports.app.use('', auth_js_1.authRoutes);
exports.app.use((req, res, next) => {
    if (req.session.isLoggedIn) {
        user_js_1.User.findById(req.session.user._id)
            .then(user => {
            req.user = user;
        })
            .catch(err => console.log(err));
        return next();
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
});
exports.app.use(multer_1.default({ storage: multerConfig, fileFilter: fileFilter }).single('image'));
exports.app.use('/graphql', express_graphql_1.graphqlHTTP({
    schema: schemas_js_1.schema,
    graphiql: true
}));
exports.app.use('/images', express_1.default.static(path_1.default.join(__dirname, '..', 'images')));
exports.app.use('/book', books_js_1.bookRoutes);
exports.app.use('/author', authors_js_1.authorRoutes);
exports.app.use('/file', fileTransfer_js_1.fileTransferRoutes);
mongoose_1.default.connect('mongodb://localhost:27017/books-and-authors')
    .then(result => {
    exports.app.listen(3000, () => {
        console.log('Now listening on 3000');
    });
})
    .catch(err => console.log("not connected"));
