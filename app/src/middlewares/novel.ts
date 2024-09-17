import { Request, Response, NextFunction } from "express";
import Novel from "../dbRedisSchema/novelSchema";
import jwt from 'jsonwebtoken';
import client from "../dbRedisSchema/redisConnect";

const secretKey = '4b88e72faee7a16a';

export async function isAuthenticated(req:Request, res:Response, next:NextFunction) {
    const cookies = req.cookies;
    const token = cookies.authToken;
    let novelName: string;
    let body = req.body;

    novelName = body.novelName;
    if (!novelName) {
        return res.status(400).json({error:'Invalid details submitted.'})
      };

    if (!token) return res.status(400).json({error: 'Unauthorized request!!'});
    let payload: any;
    payload = jwt.verify(token, secretKey);
    
    let isBlacklisted = await (await client).sIsMember('tokenBlacklist', token);
    let user:any;

    user = await (await client).get(payload.id);
    if(!payload || !user || isBlacklisted) return res.status(400).json({error: 'Unauthorized request!!'});
    req.user_id = payload.id;
    req.user_name = user.name;
    req.novelName = novelName.toLowerCase();
    
    next();
}

export async function duplicateName(req:Request, res:Response, next:NextFunction) {
    let title:string;
    title = req.novelName;

    try {
        const existingNovel = await Novel.findOne({ title }, 'title');
        if (existingNovel) {
          return res.status(400).json({error:'Novel name already exists.'});
        }
      } catch (error) {
        return res.status(500).json({error:'An error occurred.'});
      };
      next()
}