/**
 * Symmetric encryption
 * Using AES - Advanced Encryption Standard
 */

import crypto from "crypto";

// Generate a random key and IV
const generatedKey = "4eee7545c8a9eaa97bf2840633c104c5dd7d42c47cd47ebeb36bcc2d3ce36220"

interface EncryptedResult {
  encrypted: string;
  iv : any
}

export default async function encrypt(text: string) : Promise<EncryptedResult> {
    const key = Buffer.from(generatedKey, 'hex')
    const iv = crypto.randomBytes(16);
  return new Promise((resolve, reject) => {
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = "";

    cipher.setEncoding("hex");
    cipher.on("data", (chunk) => (encrypted += chunk));
    cipher.on("end", () => resolve({encrypted, iv}));
    cipher.on("error", (err) => reject(err));

    cipher.write(text);
    cipher.end();
  });
};