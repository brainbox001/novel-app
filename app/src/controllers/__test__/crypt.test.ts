import encrypt from "../crypt";

describe('encrpyt text', () => {
    it('encrypts text', async() => {
        let plain = 'hello world'
        const encryptedText = await encrypt(plain)
        expect(encryptedText).toHaveProperty('encrypted')
        expect(encryptedText.encrypted === plain).toBeFalsy()
        expect(encryptedText.iv.toString('hex').length).toEqual(32)
    });
});