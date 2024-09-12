import client from "../redisConnect";


afterAll(async () => {
    (await client).flushAll()
  })

describe('test redis keys', () => {
    it('can accept and save keys', async () => {
        (await client).set('key', 1)
        expect((await client).exists('key')).toBeTruthy()
    })
    it('can save redis hash', async () => {
        (await client).hSet('newkey', {
            "name" : 'test',
            "pass" : 'test12'
        })
        let name = await (await client).hGet('newkey', 'name')
        expect((await client).exists('newkey')).toBeTruthy()
        expect(name).toBe('test')
    });
    
    it('can increment count', async () => {
        (await client).incr('key')
        let key = await (await client).get('key')
        expect(key).toBe('2')
    });
})