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
const redis = __importStar(require("redis"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const express_1 = __importDefault(require("express"));
const redisPort = 6379;
const redisClient = redis.createClient(redisPort);
const app = express_1.default();
async function getRepos(req, res, next) {
    try {
        console.log('fetching user data from git repos');
        const username = req.params.username;
        const response = await node_fetch_1.default(`https://api.github.com/users/${username}`);
        const data = await response.json();
        const public_repos = data.public_repos;
        redisClient.setex(username, 3600, public_repos);
        res.status(200).json({
            public_repos: data.public_repos
        });
    }
    catch (err) {
        console.log(err);
    }
}
function responseCache(req, res, next) {
    const username = req.params.username;
    redisClient.get(username, (err, data) => {
        if (err)
            throw err;
        if (data !== null) {
            res.status(200).json({
                data: data
            });
        }
        else {
            next();
        }
    });
}
app.get('/repos/:username', responseCache, getRepos);
app.listen(5000, () => {
    console.log("app listening of port 5000");
});
