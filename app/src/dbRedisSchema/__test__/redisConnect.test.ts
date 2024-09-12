import {createClient} from 'redis';

const client = createClient(
    {url: 'redis://redis:6379'}
);

beforeAll(async () => {

    client.on('error', (err:Error) => console.log('Redis Client Error', err));

    await client.connect(); 
  });

describe('redis connect test', () => {
    it('can connect successful to redis', () => {
        expect(client.isReady).toBeTruthy()
        expect(client.isOpen).toBeTruthy()
    });
});