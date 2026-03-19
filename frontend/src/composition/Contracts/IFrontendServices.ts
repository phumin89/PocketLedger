import type { IApiClient } from '../../services/api/Contracts/IApiClient';
import type { IAuthService } from '../../services/auth/Contracts/IAuthService';
import type { ISystemService } from '../../services/system/Contracts/ISystemService';
import type { IUsersService } from '../../services/users/Contracts/IUsersService';

export interface IFrontendServices {
    readonly apiClient: IApiClient;
    readonly authService: IAuthService;
    readonly systemService: ISystemService;
    readonly usersService: IUsersService;
}
