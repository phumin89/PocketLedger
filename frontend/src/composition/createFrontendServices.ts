import { FetchApiClient } from '../services/api/FetchApiClient';
import { AuthService } from '../services/auth/AuthService';
import { SystemService } from '../services/system/SystemService';
import { TransactionsService } from '../services/transactions/TransactionsService';
import { UsersService } from '../services/users/UsersService';
import type { IFrontendServices } from './Contracts/IFrontendServices';

export function createFrontendServices(): IFrontendServices {
    const apiClient = new FetchApiClient();
    const authService = new AuthService({ apiClient });
    const systemService = new SystemService({ apiClient });
    const transactionsService = new TransactionsService({ apiClient });
    const usersService = new UsersService({ apiClient });

    return {
        apiClient,
        authService,
        systemService,
        transactionsService,
        usersService,
    };
}
