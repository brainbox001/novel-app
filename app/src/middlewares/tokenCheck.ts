import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const secretKey = '4b88e72faee7a16a';
export default async function checkToken(req:Request, res:Response, next:NextFunction) {
    const cookies = req.cookies;
    const token = cookies.authToken;
    if(token){
        try {
            jwt.verify(token, secretKey);
        } catch (error) {
            return res.status(402).json({error: 'Unauthorized request'});
        }
    }
    next();
}