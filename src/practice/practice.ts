import * as redis from 'redis';
import {Request, Response, NextFunction} from 'express';
import fetch from 'node-fetch';
import express from 'express';

const redisPort:number = 6379;

const redisClient = redis.createClient(redisPort);

const app = express();

async function getRepos(req:Request,res:Response,next:NextFunction){
    try{
        console.log('fetching user data from git repos');
        const username = req.params.username;
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        const public_repos = data.public_repos;

        redisClient.setex(username,3600,public_repos);

        res.status(200).json({
            public_repos:data.public_repos
        });
    }catch(err){
        console.log(err);
    }
}

function responseCache(req:Request,res:Response,next:NextFunction){
    const username = req.params.username;
    redisClient.get(username,(err, data)=>{
        if(err) throw err;
        if(data!==null){
            res.status(200).json({
                data:data
            });
        }else{
            next();
        }
    });
}

app.get('/repos/:username',responseCache, getRepos);

app.listen(5000,()=>{
console.log("app listening of port 5000");
});






