import { Request, Response } from "express";
import client from "../../dbRedisSchema/redisConnect";
import Novel from "../../dbRedisSchema/novelSchema";
import Content from "../../dbRedisSchema/contentSchema";

import mongoose from 'mongoose';

export default async function publishNovel(req:Request, res:Response) {
    let novelName: string;

    novelName = req.novelName;
    
    const nameExists = await (await client).exists(novelName);
    const image = await (await client).hGetAll(`${novelName}:image`);
    const contentListExists = await (await client).exists(`${novelName}:contentIds`);

    if (!nameExists || !image || !contentListExists) return res.status(400).json({error:"Novel details not found or removed."});

    const listLength = await (await client).lLen(`${novelName}:contentIds`);
    const category = await (await client).get(novelName);
    
    const authorId = new mongoose.Types.ObjectId(req.user_id);
    let newNovel: any = new Novel({
        title: novelName,
        coverPhoto : {
            mimeType : image.mimeType,
            buffer : image.imageBuffer
        },
        author: authorId,
        _cct : listLength,
        category
    });
    console.log('novel id related to the content -', newNovel._id);
    console.log('the length of the content id list - ', listLength);
    let savedId : string | null;
    let contentId : mongoose.Types._ObjectId;
    for (let i = 0; i < listLength; i++) {
        savedId = await (await client).lPop(`${novelName}:contentIds`);
        contentId = new mongoose.Types.ObjectId(savedId!);
        console.log('contenteId -', contentId);
        try {
            console.log(`${i + 1} saved content id -`, savedId, 'about to be saved');
            let updated = await Content.findOneAndUpdate(
                { _id: contentId }, 
                {
                  $set : {expiresAt: undefined, _novel: newNovel._id, _chapterNum: i+1}
            }, {new:true});
            console.log('Before the if statement Updated content - ', updated);
            if(updated) console.log('After the if statement Updated content - ', updated);
        } catch (error) {
            return res.status(400).json({error: "Couldn't complete request"});
        }
        
    };

    (await client).del(`${novelName}:contentIds`);
    (await client).del(`${novelName}:image`);
    (await client).del(novelName);

    await newNovel.save();
    console.log('New novel - ', newNovel);
    res.status(201).json({
        message: 'Upload complete'
    });
};