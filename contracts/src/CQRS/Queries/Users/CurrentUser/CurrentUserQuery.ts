import { Query } from '../../../Requests/Query.js';
import type { CurrentUserResponse } from './CurrentUserResponse.js';

export class CurrentUserQuery extends Query<CurrentUserResponse | null> {}
