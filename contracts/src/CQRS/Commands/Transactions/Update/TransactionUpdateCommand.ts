import type { TransactionCategory } from '../../../../enum/transaction-category.enum.ts';
import type { TransactionType } from '../../../../enum/transaction-type.enum.ts';
import { Command } from '../../../Requests/Command.ts';
import type { ITransactionUpdateRequest } from './ITransactionUpdateRequest.ts';
import type { ITransactionUpdateResponse } from './ITransactionUpdateResponse.ts';

export class TransactionUpdateCommand extends Command<ITransactionUpdateResponse> {
    public readonly id: string;
    public readonly title: string;
    public readonly amount: number;
    public readonly type: TransactionType;
    public readonly category: TransactionCategory;
    public readonly occurredAt: Date;
    public readonly note: string;

    public constructor({
        amount,
        category,
        id,
        note,
        occurredAt,
        title,
        type,
    }: ITransactionUpdateRequest) {
        super();
        this.id = id;
        this.title = title.trim();
        this.amount = amount;
        this.type = type;
        this.category = category;
        this.occurredAt = new Date(`${occurredAt}T00:00:00.000Z`);
        this.note = note.trim();
    }
}
