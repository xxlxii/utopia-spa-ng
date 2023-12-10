export class GetBalanceModel {
    _account: number = 0;

    public get account(): number {
        return this._account;
    }

    private set account(value: number) {
        this._account = value;
    }

    constructor(account: number) {
        this.account = account;
    }
}