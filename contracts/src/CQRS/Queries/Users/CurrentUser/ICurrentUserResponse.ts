import type { IQueryResponse } from '../../../Contracts/IQueryResponse.ts';

export interface ICurrentUserResponse extends IQueryResponse {
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
