import type { QueryResponse } from '../../../Contracts/IQueryResponse.js';

export interface CurrentUserResponse extends QueryResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    locale: string;
    timeZone: string;
    currencyCode: string;
    createdAt: string;
    updatedAt: string;
}
