const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

function Cryptr(secret) {
    if (!secret || typeof secret !== 'string') {
        throw new Error('Cryptr: secret must be a non-0-length string');
    }

    const key = crypto
        .createHash('sha256')
        .update(String(secret))
        .digest();

    this.encrypt = function encrypt(value) {
        if (value == null) {
            throw new Error('value must not be null or undefined');
        }

        const iv = crypto
            .randomBytes(16)
            .toString('hex')
            .slice(0, 16);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encrypted = cipher.update(String(value), 'utf8', 'hex') + cipher.final('hex');

        return iv + encrypted;
    };

    this.decrypt = function decrypt(value) {
        if (value == null) {
            throw new Error('value must not be null or undefined');
        }

        const stringValue = String(value);
        const iv = stringValue.slice(0, 16);
        const encrypted = stringValue.slice(16);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    };
}

module.exports = Cryptr;
