import type { IHandlerRegistration } from '../Types/HandlerRegistration.ts';

export interface IRequestDispatcherDependencies {
    readonly registrations: readonly IHandlerRegistration[];
}
