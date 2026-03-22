import type { FastifyPluginAsync } from 'fastify';
import { CreateTransactionRequestBodySchema } from '../../Controllers/Transactions/Schemas/CreateTransactionRequestBodySchema.ts';
import { DeleteTransactionRequestBodySchema } from '../../Controllers/Transactions/Schemas/DeleteTransactionRequestBodySchema.ts';
import { DetailTransactionRequestQuerySchema } from '../../Controllers/Transactions/Schemas/DetailTransactionRequestQuerySchema.ts';
import { ListTransactionsRequestQuerySchema } from '../../Controllers/Transactions/Schemas/ListTransactionsRequestQuerySchema.ts';
import { UpdateTransactionRequestBodySchema } from '../../Controllers/Transactions/Schemas/UpdateTransactionRequestBodySchema.ts';
import type { TransactionsController } from '../../Controllers/Transactions/TransactionsController.ts';
import { AuthenticatedRouteRegistrarBase } from '../AuthenticatedRouteRegistrarBase.ts';
import type { ITransactionsRouteDependencies } from './Contracts/ITransactionsRouteDependencies.ts';

export class TransactionsRouteRegistrar extends AuthenticatedRouteRegistrarBase {
    private readonly transactionsController: TransactionsController;

    public constructor({
        currentUserContext,
        requireAuthenticatedUserPreHandler,
        transactionsController,
    }: ITransactionsRouteDependencies) {
        super(requireAuthenticatedUserPreHandler, currentUserContext);
        this.transactionsController = transactionsController;
    }

    public readonly register: FastifyPluginAsync = async (app) => {
        this.protect(app);

        this.registerAuthenticatedValidatedControllerGet(
            app,
            this.transactionsController,
            this.transactionsController.list.name,
            ListTransactionsRequestQuerySchema,
            async (request, reply) => {
                return this.transactionsController.list(request, reply);
            }
        );

        this.registerAuthenticatedValidatedControllerGet(
            app,
            this.transactionsController,
            this.transactionsController.detail.name,
            DetailTransactionRequestQuerySchema,
            async (request, reply) => {
                return this.transactionsController.detail(request, reply);
            }
        );

        this.registerAuthenticatedValidatedControllerPost(
            app,
            this.transactionsController,
            this.transactionsController.create.name,
            CreateTransactionRequestBodySchema,
            async (request, reply) => {
                return this.transactionsController.create(request, reply);
            }
        );

        this.registerAuthenticatedValidatedControllerPut(
            app,
            this.transactionsController,
            this.transactionsController.update.name,
            UpdateTransactionRequestBodySchema,
            async (request, reply) => {
                return this.transactionsController.update(request, reply);
            }
        );

        this.registerAuthenticatedValidatedControllerDelete(
            app,
            this.transactionsController,
            this.transactionsController.delete.name,
            DeleteTransactionRequestBodySchema,
            async (request, reply) => {
                return this.transactionsController.delete(request, reply);
            }
        );
    };
}
