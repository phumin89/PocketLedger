import type { IAuthService } from '../../services/auth/Contracts/IAuthService';

export interface IUseLoginDependencies {
    readonly authService?: IAuthService;
}
