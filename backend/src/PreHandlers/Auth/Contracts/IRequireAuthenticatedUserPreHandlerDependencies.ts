import type { ICurrentUserContext } from '@pocketledger/application';
import type { IAuthCookieService } from '../../../Services/Auth/Contracts/IAuthCookieService.ts';
import type { IAuthSessionService } from '../../../Services/Auth/Contracts/IAuthSessionService.ts';

export interface IRequireAuthenticatedUserPreHandlerDependencies {
    readonly authCookieService: IAuthCookieService;
    readonly authSessionService: IAuthSessionService;
    readonly currentUserContext: ICurrentUserContext;
}
