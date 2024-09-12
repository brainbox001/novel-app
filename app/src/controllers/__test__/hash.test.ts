import hash from "../hash";
import util from 'util';

describe('hash text', () => {
    it('hash data', (done) => {
        const password = "securepassword";
        hash(password, undefined, (hashed) => {
            expect(hashed).toHaveProperty('hash');
            expect(hashed).toHaveProperty('salt');
            
            console.log(hashed.salt)
            console.log(hashed.hash)
            done(); // Notify Jest that the test is complete
        });
    });
    it('check for password match', (done) => {
        const password = "securepassword";
        let salt = '2050d9af23f54eb1725d910c648617a5'
        hash(password, salt, (hashed) => {
            
            expect(hashed.hash).toEqual('2050d9af23f54eb1725d910c648617a5:6ef7f5fe0c6a34579edd0c3574b7a6ba3d843b30ea65fdb0821e0aa73aadf20f79176ddd617bec326e6674f7a80c33e1e6fb661a830ac5a211b5d39cf27eaa26')
            done(); // Notify Jest that the test is complete
        });
    });
});
