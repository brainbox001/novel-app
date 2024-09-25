import { Request, Response } from "express";
import client from "../../dbRedisSchema/redisConnect";
import User from "../../dbRedisSchema/userSchema";
import pool from "../../workers/pool";
import jwt from 'jsonwebtoken';

const secretKey = '4b88e72faee7a16a';

export default async function verifyEmail(req:Request, res:Response) {
    let code = '';
    let body = req.body
    if (body) {
        code = body.code
    };
    let email : string;
    try {
        const redisSession = req.cookies.redisSession

        if (!redisSession) return res.redirect(307, 'user/login')
        const sessionData = JSON.parse(redisSession);
    
        email = sessionData.email;
        
    } catch (error) {
        return res.redirect(307, 'user/login')
    }
    if (!(await (await client).exists(email))){
        return res.status(400).json({error: 'Email address not found!'})
    }
    let savedCode = await (await client).get(`${email}:code`)
    // if (!savedCode || (code !== savedCode)){
    //     return res.status(400).json({error: 'Invalid or expired verification code'})
    // }
    let userDetails = await (await client).hGetAll(email)
   
    const newUser:any = new User({
        name: userDetails.name,
        email: email,
        password: {
            string: userDetails.password,
            salt: userDetails.passwordSalt
        },
        emailIsVerified: true
    });
    (await client).del(email);
    await newUser.save();
    
    const userId = await newUser._id

    const payload = {id: userId}

    const options = {
        expiresIn: '7h'
      };
    const token = jwt.sign(payload, secretKey, options);

    res.cookie('redisSession', '', {
        expires : new Date(0)
    });

    res.cookie('authToken', token, {
        httpOnly: true, 
        maxAge: 60 * 60 * 7 
      });

    await (await client).set(userId.toString(), newUser.name, {
        EX: 60 * 60 * 7
    });

    res.redirect(303, '/');
};

export async function resendMail(req:Request, res:Response) {
    let email:string;
    let name: string;
    try {
        const redisSession = req.cookies.redisSession
        const sessionData = JSON.parse(redisSession);
    
        email = sessionData.email;
        name = sessionData.name;
        
    } catch (error) {
        return res.redirect(307, 'user/login')
    };
    pool.submit(1, 'sendMail', {email, name}, async (code) => {
        await (await client).set(`${email}:code`, code, {
            EX:60*30
        })
    });
    res.status(200).json({message: 'verification code sent'})
}