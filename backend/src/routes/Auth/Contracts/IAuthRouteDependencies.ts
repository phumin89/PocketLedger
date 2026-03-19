import type { AuthController } from '../../../Controllers/Auth/AuthController.ts';

export interface IAuthRouteDependencies {
    readonly authController: AuthController;
}
