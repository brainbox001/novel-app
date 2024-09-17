import { Request, Response } from "express";
import client from "../../dbRedisSchema/redisConnect";
import Novel from "../../dbRedisSchema/novelSchema";
import Content from "../../dbRedisSchema/contentSchema";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';

const secretKey = '4b88e72faee7a16a';

export default async function publishNovel(req:Request, res:Response) {
    let novelName: string;

    novelName = req.novelName;
    
    const nameExists = await (await client).exists(novelName);
    const image = await (await client).hGetAll(`${novelName}:image`);
    const contentListExists = await (await client).exists(`${novelName}:contentIds`);

    if (!nameExists || !image || !contentListExists) return res.status(400).json({error:"Novel details not found or removed."});

    const listLength = await (await client).lLen(`${novelName}:contentIds`);

    
    const authorId = new mongoose.Types.ObjectId(req.user_id);
    let newNovel: any = new Novel({
        title: novelName,
        coverPhoto : {
            mimeType : image.mimeType,
            buffer : image.imageBuffer
        },
        author: authorId,
        contents : {}
    });

    let savedId : string | null;
    let contentId : mongoose.Types._ObjectId;
    for (let i = 0; i < listLength; i++) {
        savedId = await (await client).lPop(`${novelName}:contentIds`);
        contentId = new mongoose.Types.ObjectId(savedId!);
        newNovel.contents[`chapter${i + 1}`] = contentId
        Content.updateOne({ _id: contentId }, { $unset: { expiresAt: "" } })
        .then(() => {
        })
        .catch(() => {
            return res.status(400).json({error: "Couldn't complete request"});
        });
    };

    (await client).del(`${novelName}:contentIds`);
    (await client).del(`${novelName}:image`);
    (await client).del(novelName);

    await newNovel.save();
    
    res.status(201).json({
        message: 'Upload complete'
    });
};