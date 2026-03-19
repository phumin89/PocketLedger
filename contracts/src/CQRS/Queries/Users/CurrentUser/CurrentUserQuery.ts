import { Query } from '../../../Requests/Query.ts';
import type { ICurrentUserResponse } from './ICurrentUserResponse.ts';

export class CurrentUserQuery extends Query<ICurrentUserResponse | null> {
    public readonly userId: string;

    public constructor(userId: string) {
        super();
        this.userId = userId;
    }
}
