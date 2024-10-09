import {createClient} from 'redis';

async function redisConnect() {
    const client = createClient(
        {url: 'redis://red-cs3g2dg8fa8c73dbl7gg:6379'}
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
