export interface IAuthCookieServiceDependencies {
    readonly cookieName: string;
    readonly isSecure: boolean;
    readonly maxAgeSeconds: number;
}
