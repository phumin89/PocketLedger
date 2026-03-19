import type { IAuthCookieService } from './Contracts/IAuthCookieService.ts';
import type { IAuthCookieServiceDependencies } from './Contracts/IAuthCookieServiceDependencies.ts';

export class AuthCookieService implements IAuthCookieService {
    private readonly cookieName: string;
    private readonly isSecure: boolean;
    private readonly maxAgeSeconds: number;

    public constructor({ cookieName, isSecure, maxAgeSeconds }: IAuthCookieServiceDependencies) {
        this.cookieName = cookieName;
        this.isSecure = isSecure;
        this.maxAgeSeconds = maxAgeSeconds;
    }

    public createSessionCookieHeader(sessionToken: string): string {
        const secureDirective = this.isSecure ? '; Secure' : '';

        return (
            [
                `${this.cookieName}=${encodeURIComponent(sessionToken)}`,
                `Max-Age=${this.maxAgeSeconds}`,
                'Path=/',
                'HttpOnly',
                'SameSite=Lax',
            ].join('; ') + secureDirective
        );
    }

    public getSessionToken(cookieHeader: string | undefined): string | null {
        if (!cookieHeader) {
            return null;
        }

        const cookieSegments = cookieHeader.split(';');

        for (const cookieSegment of cookieSegments) {
            const [cookieName, ...cookieValueParts] = cookieSegment.trim().split('=');

            if (cookieName !== this.cookieName || cookieValueParts.length === 0) {
                continue;
            }

            return decodeURIComponent(cookieValueParts.join('='));
        }

        return null;
    }
}
