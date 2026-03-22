import type {
    ITransactionCreateRequest,
    ITransactionCreateResponse,
    ITransactionDeleteRequest,
    ITransactionDeleteResponse,
    ITransactionDetailResponse,
    ITransactionsListResponse,
    ITransactionUpdateRequest,
    ITransactionUpdateResponse,
} from '@pocketledger/contracts';

export interface ITransactionsService {
    getTransactionById(id: string, signal?: AbortSignal): Promise<ITransactionDetailResponse>;
    getTransactions(date: string, signal?: AbortSignal): Promise<ITransactionsListResponse>;
    createTransaction(
        createTransactionRequest: ITransactionCreateRequest
    ): Promise<ITransactionCreateResponse>;
    updateTransaction(
        updateTransactionRequest: ITransactionUpdateRequest
    ): Promise<ITransactionUpdateResponse>;
    deleteTransaction(
        deleteTransactionRequest: ITransactionDeleteRequest
    ): Promise<ITransactionDeleteResponse>;
}
