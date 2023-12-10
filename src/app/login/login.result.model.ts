export class LoginResultModel {
    private _greet: string | undefined;

    public get greet(): string | undefined {
        return this._greet;
    }

    private set greet(value: string | undefined) {
        this._greet = value;
    }

    constructor(greet: string) {
        this.greet = greet;
    }
}