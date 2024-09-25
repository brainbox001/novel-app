import { Request } from "express";
import mongoose  from "mongoose";

declare global{
    namespace Express{
      interface Request{
        user:{};
        novelName:string;
        user_id : string;
        user_name: string;
        category:string;
        sessionType: string;
        totalChapter: number;
        chapterNum : number;
        novelId : mongoose.Types._ObjectId;
      }
    }
  }