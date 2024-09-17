import { Request, Response, NextFunction } from "express";
import User from "../dbRedisSchema/userSchema";

export async function checkUserAgent(req:Request, res:Response, next:NextFunction) {
    let userAgent: string | undefined;
    userAgent = req.headers["user-agent"];
    if (userAgent === undefined || userAgent !== 'novel-app/check'){
        return res.status(400).json({error: "You're not allowed to access this route!!"})
    };
    next();
};

export async function checkDuplicate(req:Request, res:Response, next:NextFunction) {
    let email:string;
    email = req.body.email;
    try {
        let isDbUser = await User.findOne({email}, 'email');
        if (isDbUser) return res.status(400).json({error: 'User with email already exists'});
      } catch (error) {
        return res.status(500).json({error:'An error occurred.'});
      };
    next();
}