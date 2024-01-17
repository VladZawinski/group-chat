
export function encrypt(email: string): string {
    const keyBuffer = Buffer.from(email).toString('base64');
    // let ivBuffer = Buffer.alloc(16);
    // const cipher = crypto.createCipheriv('aes256', keyBuffer, ivBuffer);
    // var encrypted = cipher.update(email, 'utf8', 'hex') + cipher.final('hex');
    return keyBuffer;
}

export function decrypt(hash: string): string {
    return Buffer.from(hash, 'base64').toString();;
    // const dechpher = crypto.createDecipheriv('aes256', 'password', 'IVIV')
    // var decrypted = dechpher.update(hash, 'hex', 'utf8') + dechpher.final('utf8');
    // return decrypted;
}