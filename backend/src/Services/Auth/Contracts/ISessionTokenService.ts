export interface ISessionTokenService {
    createToken(): string;
    hashToken(sessionToken: string): string;
}
