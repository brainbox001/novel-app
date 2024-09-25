import tempSaveContent, { tempSaveNameAndImage } from "../novels/tempSaveNovel";
import { Request, Response } from "express";
import client from "../../dbRedisSchema/redisConnect";
import Novel from "../../dbRedisSchema/novelSchema";
import Content from "../../dbRedisSchema/contentSchema";

jest.mock('../../dbRedisSchema/novelSchema', () => {
    const mockNovel = {
    findOne: jest.fn().mockResolvedValue(false)
    };
    return {
        __esModule: true,
        default: mockNovel, 
    };
});

jest.mock('../../dbRedisSchema/contentSchema', () => {
    return jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(true),
        _id: 'ef134hhfhftu5833956f',
    }));
});

jest.mock('../../dbRedisSchema/redisConnect', () => {
    const mockClient = {
        exists: jest.fn().mockResolvedValue(false),
        set: jest.fn().mockResolvedValue(1),
        hSet : jest.fn().mockResolvedValue('1'),
        expire : jest.fn().mockResolvedValue('1'),
        rPush : jest.fn().mockResolvedValue(1)
    };
    return {
        __esModule: true,
        default: Promise.resolve(mockClient), 
    };
});

let res: Response;

beforeEach(() => {
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('tempoarily save novel name and image', async () => {
    const mockClient = await client
    let req: Request;
    const fileBuffer = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82]);

    req = {
        body: { novelName: 'some type of novel' },
        file : {mimetype : 'image/png', buffer : fileBuffer},
        novelName: 'some type of novel'
    } as unknown as Request;

    await tempSaveNameAndImage(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockClient.hSet).toHaveBeenCalledWith('some type of novel:image', {
        "mimeType": 'image/png',
        "imageBuffer" : fileBuffer,
    });
    expect(res.json).toHaveBeenCalledWith({
        message: 'Name and Image tempoarily stored.',
        novelName : 'some type of novel',
        fileInfo: {
          mimeType: req.file!.mimetype,
          imageStr : fileBuffer.toString('base64')
        },
      });
});

test('tempoarily save contents assiociated to a novel', async () => {
    const mockClient = await client;
    (mockClient.exists as jest.Mock).mockResolvedValue(true);
    let req: Request;

    req = {
        novelName: 'some type of novel',
        body: { 
            content : `Its Friday night at Gabe Riveras house after the lacrosse game. Our school won, so everyone is in very fine spirits, Peter most of all, because he scored the winning shot. Hes across the room playing poker with some of the guys from his team; he is sitting with his chair tipped back, his back against the wall. His hair is still wet from showering after the game. I'm on the couch with my friends Lucas Krapf and Pammy Subkoff, and they're flipping through the latest issue of Teen Vogue, debating whether or not Pammy should get bangs.`
        },

    } as unknown as Request;

    await tempSaveContent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(mockClient.rPush).toHaveBeenCalledWith(`${req.novelName}:contentIds`, 'ef134hhfhftu5833956f');
    expect(res.json).toHaveBeenCalledWith({
        message: 'content saved'
      });
})