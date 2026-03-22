import {
    TransactionDetailQuery,
    TransactionCreateCommand,
    TransactionDeleteCommand,
    TransactionUpdateCommand,
    TransactionsListQuery,
    type ITransactionDetailRequest,
    type ITransactionDetailResponse,
    type ITransactionCreateRequest,
    type ITransactionCreateResponse,
    type ITransactionDeleteRequest,
    type ITransactionDeleteResponse,
    type ITransactionsListRequest,
    type ITransactionUpdateRequest,
    type ITransactionUpdateResponse,
    type ITransactionsListResponse,
} from '@pocketledger/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { RequestControllerBase } from '../RequestControllerBase.ts';
import type { ITransactionsControllerDependencies } from './Contracts/ITransactionsControllerDependencies.ts';

export class TransactionsController extends RequestControllerBase {
    public constructor({ requestDispatcher }: ITransactionsControllerDependencies) {
        super(requestDispatcher);
    }

    public async list(
        request: FastifyRequest<{ Querystring: ITransactionsListRequest }>,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        const transactionsListResponse: ITransactionsListResponse = await this.ExecuteQuery(
            new TransactionsListQuery(request.query)
        );

        return this.Ok(reply, transactionsListResponse);
    }

    public async detail(
        request: FastifyRequest<{ Querystring: ITransactionDetailRequest }>,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        const transactionDetailResponse: ITransactionDetailResponse = await this.ExecuteQuery(
            new TransactionDetailQuery(request.query)
        );

        return this.Ok(reply, transactionDetailResponse);
    }

    public async create(
        request: FastifyRequest<{ Body: ITransactionCreateRequest }>,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        const createTransactionResponse: ITransactionCreateResponse = await this.ExecuteCommand(
            new TransactionCreateCommand(request.body)
        );

        return this.Ok(reply, createTransactionResponse);
    }

    public async update(
        request: FastifyRequest<{ Body: ITransactionUpdateRequest }>,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        const updateTransactionResponse: ITransactionUpdateResponse = await this.ExecuteCommand(
            new TransactionUpdateCommand(request.body)
        );

        return this.Ok(reply, updateTransactionResponse);
    }

    public async delete(
        request: FastifyRequest<{ Body: ITransactionDeleteRequest }>,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        const deleteTransactionResponse: ITransactionDeleteResponse = await this.ExecuteCommand(
            new TransactionDeleteCommand(request.body)
        );

        return this.Ok(reply, deleteTransactionResponse);
    }
}
