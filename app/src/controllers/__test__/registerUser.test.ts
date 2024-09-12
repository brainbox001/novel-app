import { Request, Response } from "express";
import registerUser, { saveAndSendMail } from "../users/registerUsers";
import client from "../../dbRedisSchema/redisConnect";
import hash from "../hash";
import pool from "../../workers/pool";


jest.mock("../hash", () => jest.fn((password, undefined, callback) => callback({ hash: 'hashedPassword', salt: 'randomSalt' })));

jest.mock("../../workers/pool", () => ({
  submit: jest.fn((_, __, ___, callback) => {
    callback('12345'); // Mock callback execution
  })
}));

// Mock Redis client and its methods
jest.mock("../../dbRedisSchema/redisConnect", () => {
  const mockClient = {
  connect: jest.fn().mockResolvedValue(true),
  exists: jest.fn().mockResolvedValue(true),
  get: jest.fn().mockResolvedValue('1'),
  set: jest.fn().mockResolvedValue(true),
  hSet: jest.fn().mockResolvedValue(true),
  incr: jest.fn().mockResolvedValue('2'),
  expire: jest.fn().mockResolvedValue(true),
  }
  return {
    __esModule: true,
        default: Promise.resolve(mockClient),
  }
});

beforeAll(async () => {
  const mockedClient = await client
  mockedClient.connect()
});

afterAll(async () => {
    jest.clearAllMocks();
});

jest.mock('../users/registerUsers', () => {
    const originalModule = jest.requireActual('../users/registerUsers');
  
    //Mock the default export and named export 'foo'
    return {
      __esModule: true,
      ...originalModule,
      saveAndSendMail: jest.fn().mockResolvedValue('1'),
    };
  });
  
  test('that a user can be registered succefully', async () => {
    
    let req = {
      body: {
        name : 'test',
      email: 'test@example.com',
      password: 'test123'
      },
  } as unknown as Request;
  
  let res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
  } as unknown as Response;
  
  await registerUser(req, res)

  expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message : 'User temporarily registered, please verify your email' });
  });