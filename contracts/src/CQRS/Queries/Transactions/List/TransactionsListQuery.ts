import { Query } from '../../../Requests/Query.ts';
import type { ITransactionsListRequest } from './ITransactionsListRequest.ts';
import type { ITransactionsListResponse } from './ITransactionsListResponse.ts';

export class TransactionsListQuery extends Query<ITransactionsListResponse> {
    public readonly date: Date;

    public constructor({ date }: ITransactionsListRequest) {
        super();
        this.date = new Date(`${date}T00:00:00.000Z`);
    }
}
