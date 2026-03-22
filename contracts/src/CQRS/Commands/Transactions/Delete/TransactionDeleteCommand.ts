import { Command } from '../../../Requests/Command.ts';
import type { ITransactionDeleteRequest } from './ITransactionDeleteRequest.ts';
import type { ITransactionDeleteResponse } from './ITransactionDeleteResponse.ts';

export class TransactionDeleteCommand extends Command<ITransactionDeleteResponse> {
    public readonly id: string;

    public constructor({ id }: ITransactionDeleteRequest) {
        super();
        this.id = id;
    }
}
