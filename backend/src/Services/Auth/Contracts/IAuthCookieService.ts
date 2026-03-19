export interface IAuthCookieService {
    createSessionCookieHeader(sessionToken: string): string;
    getSessionToken(cookieHeader: string | undefined): string | null;
}
