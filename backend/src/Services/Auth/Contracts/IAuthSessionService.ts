export interface IAuthSessionService {
    createSession(userId: string): Promise<string>;
    getUserId(sessionToken: string): Promise<string | null>;
}
