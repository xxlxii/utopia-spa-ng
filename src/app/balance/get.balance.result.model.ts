export class GetBalanceResultModel {
    private _balance: number | null = null;

    constructor(balance: number | null) {
        this.balance = balance;
    }

    public get balance(): number | null {
        return this._balance;
    }

    private set balance(value: number | null) {
        this._balance = value;
    }
}