import type { ICommandResponse } from '../../../Contracts/ICommandResponse.ts';
import type { ICurrentUserResponse } from '../../../Queries/Users/CurrentUser/ICurrentUserResponse.ts';

export interface ILoginResponse extends ICommandResponse {
    user: ICurrentUserResponse;
}
