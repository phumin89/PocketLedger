import type { TransactionCategory } from '../../../../enum/transaction-category.enum.ts';
import type { TransactionType } from '../../../../enum/transaction-type.enum.ts';
import { Command } from '../../../Requests/Command.ts';
import type { ITransactionCreateRequest } from './ITransactionCreateRequest.ts';
import type { ITransactionCreateResponse } from './ITransactionCreateResponse.ts';

export class TransactionCreateCommand extends Command<ITransactionCreateResponse> {
    public readonly title: string;
    public readonly amount: number;
    public readonly type: TransactionType;
    public readonly category: TransactionCategory;
    public readonly occurredAt: Date;
    public readonly note: string;

    public constructor({
        amount,
        category,
        note,
        occurredAt,
        title,
        type,
    }: ITransactionCreateRequest) {
        super();
        this.title = title.trim();
        this.amount = amount;
        this.type = type;
        this.category = category;
        this.occurredAt = new Date(`${occurredAt}T00:00:00.000Z`);
        this.note = note.trim();
    }
}
