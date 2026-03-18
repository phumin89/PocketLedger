import type { ICqrs } from './Contracts/ICqrs.js';
import { CqrsSingleton } from './CqrsSingleton.js';

export const cqrs: ICqrs = CqrsSingleton.shared;
