import client from "../../dbRedisSchema/redisConnect";
import { Request, Response } from "express";
import logoutUser from "../users/logoutUser";

jest.mock('../../dbRedisSchema/redisConnect', () => {
    const mockClient = {
       sAdd: jest.fn().mockImplementation((x, ...args) => Promise.resolve(args)),
    };
    return {
        __esModule: true,
        default: Promise.resolve(mockClient), 
    };
});

let req: Request, res: Response;
beforeEach(() => { 

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        redirect : jest.fn(),
        cookie: jest.fn(),
    } as unknown as Response;

    jest.clearAllMocks();
});

test('redirect request without cookies', async () => {
    req = {} as unknown as Request;

    await logoutUser(req, res);

    expect(res.redirect).toHaveBeenCalledWith(303, '/');
    expect(res.status).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
});

test('logout token session', async () => {
    let token:string;
    token = '2364rgfftttvbt85t:we1424aqqqfuug';
    req = {
        cookies: { authToken: token },
    } as unknown as Request;

    await logoutUser(req, res)
    
    expect(res.cookie).toHaveBeenCalledWith('authToken', '', {
        expires : new Date(0)
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect((await client).sAdd).toHaveBeenCalledWith('tokenBlacklist', token);
});

test('logout redis session', async () => {
    req = {
        cookies: { redisSession: JSON.stringify({ email: 'test@example.com', name: 'Dan' }) },
    } as unknown as Request;

    await logoutUser(req, res);

    expect(res.cookie).toHaveBeenCalledWith('redisSession', '', {
        expires : new Date(0)
    });
    expect(res.status).toHaveBeenCalledWith(200);  
});