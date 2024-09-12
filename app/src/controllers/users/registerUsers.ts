import { Request, Response } from "express";
import client from "../../dbRedisSchema/redisConnect";
import pool from "../../workers/pool";
import hash from "../hash";

interface userDetails {
    name : string;
    email: string;
    password: string
}

export async function saveAndSendMail(body:userDetails) : Promise<string> {
    console.log('This function has been called')
    
    await (await client).hSet(body.email, {
        "name" : body.name,
        "emailIsVerifed" : "false"
    });
    hash(body.password, undefined, async(storedHash) => {
        await (await client).hSet(body.email, {
            "password" : storedHash.hash,
            "passwordSalt" : storedHash.salt
        });
    });
    
    pool.submit(1, 'sendMail', {email:body.email, name:body.name}, async (code) => {
        await (await client).set(`${body.email}:code`, code, {
            EX:60*30
        })
        // console.log(await (await client).hGetAll(body.email))
    });
    
    await (await client).expire(body.email, 2_500_000_000);
    return '1'
};

export default async function registerUser(req:Request, res:Response) {
    const body : userDetails = req.body;  
    console.log(await saveAndSendMail(body))
    const redisSession = {
        email: body.email,
        name: body.name
    }
    res.cookie('redisSession', JSON.stringify(redisSession), {
        httpOnly: true,
        expires : new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    res.status(200).json({message : 'User temporarily registered, please verify your email'});
};