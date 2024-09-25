import { Request, Response } from "express";
import ViewedBook from "../../dbRedisSchema/viewBookSchema";
import Content from "../../dbRedisSchema/contentSchema";
import funcObj from "./preference";
import mongoose from 'mongoose';

interface SetObj {
    setViewed: (user:string, novel:string) => Promise<void>
}

export const setObj:SetObj = {
    setViewed : setViewedBook
}
async function setViewedBook(user:string, _novel:string) {
    let _user = new mongoose.Types.ObjectId(user);
    let exists = await ViewedBook.findOne({_user, _novel});
    if(!exists){
        new ViewedBook({
            _user,
            _novel
        }).save();
    };
}

export async function getChapter(req:Request, res:Response) {
    let novel: string;
    let category: string;
    let _user: string;
    let sessionType:string;
    let _chapterNum : number;
    let totalChapter : number;
    let content: any;
    let novelId = req.novelId;
    totalChapter = req.totalChapter;
    novel = req.novelName;
    _chapterNum = req.chapterNum;
    _user = req.user_id;
    category = req.category;
    sessionType = req.sessionType;
    content = '';
    if (sessionType !== 'token') {
        let readLimit : number;
        readLimit = Math.round(((40/100) * totalChapter));
        if (totalChapter < 4 || _chapterNum <=readLimit){
         content = (await Content.findOne({_novel:novelId, _chapterNum}, 'content'));
         if (content) content = content.content
        }
    }
    else{
        funcObj.setPref(_user, novel, totalChapter, category);
        setObj.setViewed(_user, novel);
        content = (await Content.findOne({_novel:novelId, _chapterNum}, 'content'))
        if (content) content = content.content
    }

    res.status(200).json({
        totalChapter,
        novel,
        content,
        category,
        _chapterNum
    })
}