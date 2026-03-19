import { FetchApiClient } from '../services/api/FetchApiClient';
import { SystemService } from '../services/system/SystemService';
import { UsersService } from '../services/users/UsersService';
import type { IFrontendServices } from './Contracts/IFrontendServices';

export function createFrontendServices(): IFrontendServices {
    const apiClient = new FetchApiClient();
    const systemService = new SystemService({ apiClient });
    const usersService = new UsersService({ apiClient });

    return {
        apiClient,
        systemService,
        usersService,
    };
}
