import publishNovel from "../novels/publishNovel";
import { Request, Response } from "express";
import client from "../../dbRedisSchema/redisConnect";
import Novel from "../../dbRedisSchema/novelSchema";
import Content from "../../dbRedisSchema/contentSchema";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';

const verifySpy = jest.spyOn(jwt, 'verify') as jest.Mock
verifySpy.mockReturnValue({id : 'ey274832h3hfhtre3'});

const mongooseSpy = jest.spyOn(mongoose.Types, 'ObjectId') as jest.Mock
mongooseSpy.mockReturnValue('ey274832h3hfhtre3');

jest.mock('../../dbRedisSchema/contentSchema', () => {
    const mockNovel = {
    updateOne: jest.fn().mockResolvedValue('done')
    };
    return {
        __esModule: true,
        default: mockNovel, 
    };
});

jest.mock('../../dbRedisSchema/novelSchema', () => {
    return jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(true),
        contents: {},
    }));
});

jest.mock('../../dbRedisSchema/redisConnect', () => {
    const fileBuffer = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82]);
    let count = 1
    const mockClient = {
        exists: jest.fn().mockResolvedValue(true),
        lLen: jest.fn().mockResolvedValue(5),
        lPop: jest.fn(() => Promise.resolve(`drftfb4${count++}`)),
        hGetAll : jest.fn().mockResolvedValue({
            mimeType: 'image/png',
            imageBuffer : fileBuffer,
        }),
        del : jest.fn().mockResolvedValue('0'),
        get : jest.fn().mockResolvedValue('thriller'),
    };
    return {
        __esModule: true,
        default: Promise.resolve(mockClient), 
    };
});

let req:Request, res: Response;

beforeEach(() => {
    req = {
        body : {novelName : 'A stitch in time saves 9'},
        cookies: { authToken: JSON.stringify({token : 'drrh45urfdh3294jrfnh'}) }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('function calls', async () => {
    let count = 1
    const mockClient = await client

    await publishNovel(req, res);

    expect(mockClient.exists).toHaveBeenCalledTimes(2);
    expect(Content.updateOne).toHaveBeenCalled();
    expect(mockClient.lPop).toHaveBeenCalledTimes(5);
});
