import {createClient} from 'redis';

async function redisConnect() {
    const client = createClient(
        {url: 'redis://red-cs3fue3v2p9s73effaig:6379'}
    );
    
    client.on('error', (err:Error) => {
        console.log('Redis error', err)
        return null
    });   
    await client.connect(); 
    return client
}
const client = redisConnect()
export default client
