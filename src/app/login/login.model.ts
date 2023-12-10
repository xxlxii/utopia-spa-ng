export class LoginModel {
    private _username: string | null = null;

    public get username(): string | null {
        return this._username;
    }

    private set username(value: string | null) {
        this._username = value;
    }

    private _pin: number | null = null;
    public get pin(): number | null {
        return this._pin;
    }

    private set pin(value: number | null) {
        this._pin = value;
    }

    constructor(username: string, pin: number) {
        this.username = username;
        this.pin = pin;
    }
}