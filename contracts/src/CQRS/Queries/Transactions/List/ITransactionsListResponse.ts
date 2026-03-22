import type { ITransaction } from '../../../../Transactions/ITransaction.ts';
import type { IQueryResponse } from '../../../Contracts/IQueryResponse.ts';

export interface ITransactionsListResponse extends IQueryResponse {
    transactions: ITransaction[];
}
