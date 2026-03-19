import type { IRequestDispatcher } from '../../../CQRS/Contracts/IRequestDispatcher.ts';
import type { IAuthCookieService } from '../../../Services/Auth/Contracts/IAuthCookieService.ts';
import type { IAuthSessionService } from '../../../Services/Auth/Contracts/IAuthSessionService.ts';

export interface IAuthControllerDependencies {
    readonly authCookieService: IAuthCookieService;
    readonly authSessionService: IAuthSessionService;
    readonly requestDispatcher: IRequestDispatcher;
}
