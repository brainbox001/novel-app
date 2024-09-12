// verifyEmail.test.ts
import verifyEmail, {resendMail} from '../users/verifyResendEmail';
import { Request, Response } from 'express';
import client from '../../dbRedisSchema/redisConnect';
import User from '../../dbRedisSchema/userSchema';
import pool from '../../workers/pool';
import jwt from 'jsonwebtoken';

// import connectDB from '../../dbRedisSchema/dbConnect';

jest.mock("../../workers/pool", () => ({
    submit: jest.fn((_, __, ___, callback) => {
      callback('12345'); 
    })
  }));

// jest.mock("../../dbRedisSchema/dbConnect", () => {
//     return {
//         __esModule: true,
//             default: jest.fn().mockResolvedValue(undefined),
//       }
// })

jest.mock('../../dbRedisSchema/redisConnect', () => {
    const mockClient = {
        connect: jest.fn().mockResolvedValue(true),
        exists: jest.fn().mockResolvedValue(true),
        get: jest.fn().mockResolvedValue('123456'),
        set: jest.fn().mockResolvedValue(1),
        del: jest.fn(),
        hGetAll: jest.fn().mockResolvedValue({
            name: 'Test User',
            password: 'hashedpassword',
            passwordSalt: 'somesalt',
            emailIsVerified: false,
        }),
    };
    return {
        __esModule: true,
        default: Promise.resolve(mockClient), 
    };
});

const signSpy = jest.spyOn(jwt, 'sign') as jest.Mock
signSpy.mockReturnValue('quwerhtht.dffjgjgjgjfbsbd');

jest.mock('../../dbRedisSchema/userSchema', () => {
    return jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(true),
        _id: 'ef12345fgh',
    }));
});

let req: Request, res: Response;

beforeEach(() => {
    req = {
        body: { code: '123456' },
        cookies: { redisSession: JSON.stringify({ email: 'test@example.com', name: 'Dan' }) },
    } as unknown as Request;

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        redirect: jest.fn(),
        cookie: jest.fn(),
    } as unknown as Response;
});

afterEach(() => {
    jest.clearAllMocks();
});

test("should return an error if code doesn't match", async () => {
    req.body = { code: '12345' };
    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired verification code' });
});

test("should redirect user if redisSession cookie not found", async () => {
    req = {
        body: { code: '123456' },
    } as unknown as Request;
    console.log(req)
    await verifyEmail(req, res)

    expect(res.redirect).toHaveBeenCalledWith(307, 'user/login')
});

test('should verify the email and save the user', async () => {
    const mockClient = await client;

    await verifyEmail(req, res);

    expect(mockClient.exists).toHaveBeenCalledWith('test@example.com');
    expect(mockClient.get).toHaveBeenCalledWith('test@example.com:code');
    expect(mockClient.hGetAll).toHaveBeenCalledWith('test@example.com');
    expect(User).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: {
            string: 'hashedpassword',
            salt: 'somesalt',
        },
        emailIsVerified: true,
    });
    expect(res.redirect).toHaveBeenCalledWith(303, '/')
    expect(signSpy).toHaveBeenCalled()
});

test("should return an error if email is not found", async () => {
    const mockClient = await client;
    (mockClient.exists as jest.Mock).mockResolvedValue(false);

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email address not found!' });
});

test('resending email', async () => {
    await resendMail(req, res)

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({message: 'verification code sent'});
});

test('redirect if cookie not found', async () => {
    req = {
        body: { code: '123456' },
    } as unknown as Request;

    await resendMail(req, res)
    expect(res.redirect).toHaveBeenCalledWith(307, 'user/login')
})