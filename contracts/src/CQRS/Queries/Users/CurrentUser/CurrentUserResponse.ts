import type { IQueryResponse } from '../../../Contracts/IQueryResponse.js';

export interface CurrentUserResponse extends IQueryResponse {
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
