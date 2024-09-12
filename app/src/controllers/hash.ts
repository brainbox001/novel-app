import crypto from "crypto";

interface StoredHash{ 
    hash: string; 
    salt: any; 
    N: number; 
    r: number; 
    p: number; 
};
export default  function hash(password:string, salt: any,  callback: (result :StoredHash)  => void) {
  if (salt === undefined){
    salt = crypto.randomBytes(16);
  }
  else {
    salt = Buffer.from(salt, 'hex')
  }
 // 16 bytes salt
const keyLength = 64; // 64 bytes derived key length
const costFactor = 16384; // N
const blockSize = 8; // r
const parallelization = 1; // p
let storedHash: StoredHash
crypto.scrypt(
  password,
  salt,
  keyLength,
  { N: costFactor, r: blockSize, p: parallelization },
  (err, derivedKey) => {
    if (err) throw err;
    // Combine the salt and the derived key
    const hash = `${salt.toString("hex")}:${derivedKey.toString("hex")}`;

    // Storing hash and salt
    storedHash = {
      hash: hash,
      salt: salt.toString("hex"),
      N: costFactor,
      r: blockSize,
      p: parallelization,
    };
    callback(storedHash)
  }
);
};
