import { createHash, randomBytes } from 'node:crypto';
import type { ISessionTokenService } from './Contracts/ISessionTokenService.ts';

export class SessionTokenService implements ISessionTokenService {
    public createToken(): string {
        return randomBytes(32).toString('base64url');
    }

    public hashToken(sessionToken: string): string {
        return createHash('sha256').update(sessionToken).digest('hex');
    }
}
