import type { Command, Query } from '@pocketledger/contracts';

export type DispatchableRequest = Command<unknown> | Query<unknown>;
