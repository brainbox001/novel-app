import { Request, Response } from "express";
import client from "../../dbRedisSchema/redisConnect";

export default async function logoutUser(req:Request, res:Response) {
    const cookies = req.cookies
    if (!cookies) return res.redirect(303, '/');

    if (cookies['authToken']){
        const token = cookies.authToken;
      
        await (await client).sAdd('tokenBlacklist', token);
        res.cookie('authToken', '', {
            expires : new Date(0)
        });
    }

    else if (cookies['redisSession']){
        res.cookie('redisSession', '', {
            expires : new Date(0)
        });
    };

    res.status(200).json({message: 'Logout successful'});
};