import { Request, Response } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken';
import mongoose from 'mongoose';
import Recommend from "../../dbRedisSchema/recommendSchema";
import Preference from "../../dbRedisSchema/preferenceSchema";
import Novel from "../../dbRedisSchema/novelSchema";

const secretKey = '4b88e72faee7a16a';

interface Payload extends JwtPayload {
    id: string;
}

async function recommend(userId: mongoose.Types.ObjectId) {
    let userpref = await Preference.findOne({userId}, 'category').sort({visitCount : -1});
    if (!userpref) return;
    let category = userpref.category;
 
    let novelIds = await Novel.find({category}, { _id: 1 }).limit(10).lean();

    if (novelIds.length > 0){
        novelIds.forEach((novel: { _user: any; _novel: any; _id: any; }) => {
            novel._user = userId;
            novel._novel = novel._id;
            delete novel._id;
          });
        let inserted = await Recommend.insertMany(novelIds);
    }
}

export default async function recommender(req:Request, res:Response) {
    console.log('request received')
    const cookies = req.cookies;
    const token = cookies.authToken;
    if (!token) {
        return res.status(400).json({error:'unauthenticated user'})
    };
    res.setHeader('Content-Type', 'application/json');
    let payload  = jwt.verify(token, secretKey) as Payload;
    let id  = payload.id;
    let _user = new mongoose.Types.ObjectId(id);
    let found = false;
    let isFirst = true
    let foundRecommendation = await Recommend.find({_user});
    await Recommend.find({_user}).populate('_novel').
    cursor().
    eachAsync(async (doc: any) => {
        if (doc && doc._novel && doc._novel.coverPhoto) {
            doc._novel.coverPhoto.buffer = (doc._novel.coverPhoto.buffer).toString('base64');
        }

       found = true;
       if(isFirst) {
        isFirst = false;
        res.status(200);
        res.write('[');
    } else {res.write(',')};

       res.write(JSON.stringify(doc));
    });
    if(found) {
        res.write(']');
        return res.end();
    };
    recommend(_user);
    res.status(201).json({message: 'Recommendation would probably be added on next request'});
}