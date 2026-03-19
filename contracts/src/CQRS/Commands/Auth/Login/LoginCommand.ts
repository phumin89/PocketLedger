import { Command } from '../../../Requests/Command.ts';
import type { ILoginRequest } from './ILoginRequest.ts';
import type { ILoginResponse } from './ILoginResponse.ts';

export class LoginCommand extends Command<ILoginResponse | null> {
    public readonly username: string;
    public readonly password: string;

    public constructor({ password, username }: ILoginRequest) {
        super();
        this.username = username.trim().toLowerCase();
        this.password = password;
    }
}
