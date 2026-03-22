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
import type { IApiClient } from '../api/Contracts/IApiClient';
import type { ITransactionsService } from './Contracts/ITransactionsService';
import type { ITransactionsServiceDependencies } from './Contracts/ITransactionsServiceDependencies';

export class TransactionsService implements ITransactionsService {
    private readonly apiClient: IApiClient;

    public constructor({ apiClient }: ITransactionsServiceDependencies) {
        this.apiClient = apiClient;
    }

    public getTransactionById(
        id: string,
        signal?: AbortSignal
    ): Promise<ITransactionDetailResponse> {
        const searchParams = new URLSearchParams({
            id,
        });

        return this.apiClient.requestJson<ITransactionDetailResponse>(
            `/api/transactions/detail?${searchParams.toString()}`,
            {
                signal,
            }
        );
    }

    public getTransactions(date: string, signal?: AbortSignal): Promise<ITransactionsListResponse> {
        const searchParams = new URLSearchParams({
            date,
        });

        return this.apiClient.requestJson<ITransactionsListResponse>(
            `/api/transactions/list?${searchParams.toString()}`,
            {
                signal,
            }
        );
    }

    public createTransaction(
        createTransactionRequest: ITransactionCreateRequest
    ): Promise<ITransactionCreateResponse> {
        return this.apiClient.requestJson<ITransactionCreateResponse>('/api/transactions/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createTransactionRequest),
        });
    }

    public updateTransaction(
        updateTransactionRequest: ITransactionUpdateRequest
    ): Promise<ITransactionUpdateResponse> {
        return this.apiClient.requestJson<ITransactionUpdateResponse>('/api/transactions/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateTransactionRequest),
        });
    }

    public deleteTransaction(
        deleteTransactionRequest: ITransactionDeleteRequest
    ): Promise<ITransactionDeleteResponse> {
        return this.apiClient.requestJson<ITransactionDeleteResponse>('/api/transactions/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deleteTransactionRequest),
        });
    }
}
