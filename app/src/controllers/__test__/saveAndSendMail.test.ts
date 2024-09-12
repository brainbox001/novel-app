import client from "../../dbRedisSchema/redisConnect";
import registerUser, { saveAndSendMail } from "../users/registerUsers";
import { Request, Response } from "express";
import hash from "../hash";
import pool from "../../workers/pool";


jest.mock("../crypt", () => jest.fn().mockResolvedValue({ encrypted: 'encryptedValue', iv: 'initializationVector' }));
jest.mock("../hash", () => jest.fn((password,undefined, callback) => callback({ hash: 'hashedPassword', salt: 'randomSalt' })));
jest.mock("../../workers/pool", () => ({
  submit: jest.fn((_, __, ___, callback) => {
    callback('12345');
  })
}));


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

describe('saveAndSendMail', () => {

  it('should return the correct user count', async () => {
    const result = await saveAndSendMail({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    });

 
    expect(result).toEqual('1');
    
  });
});
