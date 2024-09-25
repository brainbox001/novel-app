import client from "../../dbRedisSchema/redisConnect";
import jwt from "jsonwebtoken";
import User from "../../dbRedisSchema/userSchema";
import loginUser from "../users/loginUser";
import { Request, Response } from "express";

jest.mock('../../dbRedisSchema/redisConnect', () => {
    const mockClient = {
        connect: jest.fn().mockResolvedValue(true),
        exists: jest.fn().mockResolvedValue(true),
        set: jest.fn().mockResolvedValue('1'),
        hmGet: jest.fn().mockResolvedValue(['2050d9af23f54eb1725d910c648617a5:6ef7f5fe0c6a34579edd0c3574b7a6ba3d843b30ea65fdb0821e0aa73aadf20f79176ddd617bec326e6674f7a80c33e1e6fb661a830ac5a211b5d39cf27eaa26', '2050d9af23f54eb1725d910c648617a5', 'Tested']),
    };
    return {
        __esModule: true,
        default: Promise.resolve(mockClient), 
    };
});

jest.mock('../../dbRedisSchema/userSchema', () => {
    const mockUser = {
    findOne: jest.fn().mockResolvedValue({_id: '3248rfhtgder5', password: {string:'2050d9af23f54eb1725d910c648617a5:6ef7f5fe0c6a34579edd0c3574b7a6ba3d843b30ea65fdb0821e0aa73aadf20f79176ddd617bec326e6674f7a80c33e1e6fb661a830ac5a211b5d39cf27eaa26', salt:'2050d9af23f54eb1725d910c648617a5'}})
    };
    return {
        __esModule: true,
        default: mockUser, 
    };
});

const signSpy = jest.spyOn(jwt, 'sign') as jest.Mock
signSpy.mockReturnValue('quwerhtht.dffjgjgjgjfbsbd');

let req: Request, res: Response;
beforeEach(() => {
    req = {
        body: { email: 'test@example.com', password: 'securepassword' },
        
    } as unknown as Request;

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
    } as unknown as Response;

    jest.clearAllMocks();
});

test('can login db User', async () => {
    const mockClient = await client;
    (mockClient.exists as jest.Mock).mockResolvedValue(false);
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({success: 'Db user successfully logged in!!'});
    expect(res.cookie).toHaveBeenCalled()
});

test('can login redis User', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const mockClient = await client;
    (mockClient.exists as jest.Mock).mockResolvedValue(true);
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({success: 'Redis user successfully logged in!!'});
    expect(res.cookie).toHaveBeenCalled()
});

test('can detect incorrect password', async () => {
    let req: Request;
    req = {
        body: { email: 'test@example.com', password: 'mypassword' },   
    } as unknown as Request;

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error: 'Incorrect Password'});
    expect(res.cookie).not.toHaveBeenCalled()
});

test('invalidate incomplete body request', async () => {
    let req: Request;
    req = {
        body: { email: 'test@example.com'},   
    } as unknown as Request;
    
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error: 'Invalid Credentials'});
});

test('for user not found', async() => {
    const mockClient = await client;
    (mockClient.exists as jest.Mock).mockResolvedValue(false);
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await loginUser(req, res);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({error: 'User not found'});
    expect(res.cookie).not.toHaveBeenCalled()
});