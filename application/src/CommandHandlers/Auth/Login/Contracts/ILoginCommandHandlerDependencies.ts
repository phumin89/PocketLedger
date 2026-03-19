import type { IPasswordHashingService } from '../../../../Auth/Contracts/IPasswordHashingService.ts';
import type { IRequestHandlerDependencies } from '../../../../CQRS/Contracts/IRequestHandlerDependencies.ts';

export interface ILoginCommandHandlerDependencies extends IRequestHandlerDependencies {
    readonly passwordHashingService: IPasswordHashingService;
}
