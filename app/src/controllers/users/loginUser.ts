import { Request, Response } from "express";
import client from "../../dbRedisSchema/redisConnect";
import User from "../../dbRedisSchema/userSchema";
import hash from "../hash";
import jwt from "jsonwebtoken";

function hashPromise(password: string, salt: any) {
    return new Promise((resolve, reject) => {
        hash(password, salt, (storedHash) => {
            resolve(storedHash)
        });
    });
};

export default async function loginUser(req:Request, res:Response) {
    let email: string;
    let password: string;
    let storedPassword: string | undefined;
    let storedPasswordSalt: string | undefined;
    let details! : string[];
    let storedHash: any;

    let body = req.body
    if(!body || !body.email || !body.password) return res.status(400).json({error: 'Invalid Credentials'});
    email = body.email
    password = body.password

    let isDbUser = await User.findOne({email:email}, 'password');

    if (isDbUser){
        storedPassword = isDbUser.password.string
        storedPasswordSalt = isDbUser.password.salt
        storedHash = await hashPromise(password, storedPasswordSalt);

        if (storedHash.hash !== storedPassword) return res.status(400).json({error: 'Incorrect Password'});

        const secretKey = '4b88e72faee7a16a';
            const userId = isDbUser._id;
            console.log(userId);
            const payload = {id: userId};

            const options = {
                expiresIn: '7h'
            };
            const token = jwt.sign(payload, secretKey, options);

            res.cookie('authToken', token, {
                httpOnly: true, 
                maxAge: 60 * 60 * 7 
            });
            return res.status(200).json({success: `Db user successfully logged in!!`});
    }

    let isRedisUser = await (await client).exists(email);

    if (isRedisUser){

        details = await (await client).hmGet(email, ['password', 'passwordSalt', 'name']);
        storedPassword = details[0]
        storedPasswordSalt = details[1]
        storedHash = await hashPromise(password, storedPasswordSalt);

        if (storedHash.hash !== storedPassword) return res.status(400).json({error: 'Incorrect Password'});
        const name = details[2]
        const redisSession = {
            email: email,
            name: name
        }
        res.cookie('redisSession', JSON.stringify(redisSession), {
            httpOnly: true,
            expires : new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        return res.status(200).json({success: `Redis user successfully logged in!!`});
    };

    
    return res.status(404).json({error: 'User not found'});
};