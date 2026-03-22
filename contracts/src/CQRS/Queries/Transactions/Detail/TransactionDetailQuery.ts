import { Query } from '../../../Requests/Query.ts';
import type { ITransactionDetailRequest } from './ITransactionDetailRequest.ts';
import type { ITransactionDetailResponse } from './ITransactionDetailResponse.ts';

export class TransactionDetailQuery extends Query<ITransactionDetailResponse> {
    public readonly id: string;

    public constructor({ id }: ITransactionDetailRequest) {
        super();
        this.id = id;
    }
}
