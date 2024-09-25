import { getChapter, setObj } from "../novels/getChapter";
import Content from "../../dbRedisSchema/contentSchema";
import { Request, Response } from "express";
import mongoose from 'mongoose';
import funcObj from "../novels/preference";
import client from "../../dbRedisSchema/redisConnect";

jest.mock('../../dbRedisSchema/contentSchema', () => {
    const mockContent = {
        findOne : jest.fn().mockResolvedValue({content : 'A random content has been given back to you.'})
        };
        return {
            __esModule: true,
            default: mockContent, 
        };
});

jest.mock('../../dbRedisSchema/redisConnect', () => {
    const mockClient = {
        set : jest.fn().mockResolvedValue('1'),
    };
    return {
        __esModule: true,
        default: Promise.resolve(mockClient), 
    };
});

afterEach(() => {
    jest.clearAllMocks();
});

let req: Request, res:Response;
test('getting chapters', async() => {
    let prefSpy = jest.spyOn(funcObj, 'setPref').mockResolvedValue()
    let setSpy = jest.spyOn(setObj, 'setViewed').mockResolvedValue()
    let id = mongoose.Types.ObjectId('668heyr4rhy6');
    req = {
        novelId : id,
        totalChapter : 4,
        novel : 'A stitch in time',
        chapterNum : 3,
        _user : '663ni55gjdri59688gj',
        category : 'thriller',
        sessionType : 'token'
    } as unknown as Request;

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;
    await getChapter(req, res);
    expect(Content.findOne as jest.Mock).toHaveBeenCalled();
    expect(prefSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
});