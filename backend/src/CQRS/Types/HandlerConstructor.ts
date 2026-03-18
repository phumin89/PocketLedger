import type { HandlerInstance } from './HandlerInstance.js';

export type HandlerConstructor = {
    new (...args: unknown[]): HandlerInstance<unknown, unknown>;
    name: string;
    requestName?: string;
};
