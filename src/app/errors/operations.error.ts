export class OperationsError extends Error {
    constructor(reason: string) {
        super(reason);
    }
}