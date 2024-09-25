import { Request, Response, NextFunction } from "express";
import Novel from "../dbRedisSchema/novelSchema";
import jwt from 'jsonwebtoken';
import client from "../dbRedisSchema/redisConnect";
import mongoose from 'mongoose';

const secretKey = '4b88e72faee7a16a';

export async function isAuthenticated(req:Request, res:Response, next:NextFunction) {
    const cookies = req.cookies;
    const token = cookies.authToken;
    let novelName: string;
    let category : string;
    let body = req.body;

    novelName = body.novelName;
    category = body.category || 'others';
    
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
    req.category = category.toLowerCase();

    next();
};

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
      next();
};

export async function chapters(req:Request, res:Response, next:NextFunction) {
	let body = req.body;
	if (!body || !body.novelId) return res.status(400).json({error : 'Incorrect details'});

	let novel: string|undefined;
  	let category: string|undefined;
    let _user: string;
    let sessionType:string;
    let _chapterNum : number;
    let totalChapter : number;
    let novelId : mongoose.Types._ObjectId;
	  let payload: any;

	  const cookies = req.cookies;
    const token = cookies.authToken;
	sessionType = 'others';
	if (token){	
    	payload = jwt.verify(token, secretKey);
		_user = payload.id;
		sessionType = 'token';
		req.user_id = _user;
	}
	novel = req.params.novelName;
	category = req.params.category;
	_chapterNum = parseInt(req.params.chapterNum as string);
	totalChapter = body.totalChapter;
	novelId = new mongoose.Types.ObjectId(body.novelId);

	if (!novel || !category || !_chapterNum || !totalChapter || !novelId || _chapterNum > totalChapter) return res.status(404).json({error: 'not found'});
	req.novelName = novel.toLowerCase();
	req.category = category.toLowerCase();
	req.sessionType = sessionType;
	req.chapterNum = _chapterNum;
	req.totalChapter = totalChapter;
	req.novelId = novelId;
	next();
};
