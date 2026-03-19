import type { IPasswordHashingService } from '@pocketledger/application';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

export class PasswordHashingService implements IPasswordHashingService {
    public async hashPassword(password: string): Promise<string> {
        const salt = randomBytes(16).toString('hex');
        const derivedKey = await this.deriveKey(password, salt);

        return `${salt}:${derivedKey.toString('hex')}`;
    }

    public async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
        const [salt, expectedHash] = passwordHash.split(':');

        if (!salt || !expectedHash) {
            return false;
        }

        const derivedKey = await this.deriveKey(password, salt);
        const expectedKey = Buffer.from(expectedHash, 'hex');

        if (derivedKey.length !== expectedKey.length) {
            return false;
        }

        return timingSafeEqual(derivedKey, expectedKey);
    }

    private deriveKey(password: string, salt: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            scrypt(password, salt, 64, (error, derivedKey) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(derivedKey as Buffer);
            });
        });
    }
}
