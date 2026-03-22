import type { IAuthCookieService } from '../../../Services/Auth/Contracts/IAuthCookieService.ts';
import type { IAuthSessionService } from '../../../Services/Auth/Contracts/IAuthSessionService.ts';
import type { IRequestControllerDependencies } from '../../Contracts/IRequestControllerDependencies.ts';

export interface IAuthControllerDependencies extends IRequestControllerDependencies {
    readonly authCookieService: IAuthCookieService;
    readonly authSessionService: IAuthSessionService;
}
