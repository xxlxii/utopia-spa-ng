import { AbstractControl, FormGroup } from "@angular/forms";
import { Observer } from "rxjs";

export enum State {
    Initial = 1,
    Wait,
    Ok,
    Error
};

export abstract class ComponentBase<TFormGroup extends { [K in keyof TFormGroup]: AbstractControl<any, any>; }, TResultModel extends Object> {
    formGroup!: FormGroup<TFormGroup>;
    State = State;
    result: TResultModel | null = null;

    private _state: State | undefined;
    get state(): State | undefined {
        return this._state;
    }
    protected set state(value: State | undefined) {
        this._state = value;
    }

    private _error: Error | undefined;
    get error() {
        return this._error;
    }
    protected set error(value: Error | undefined) {
        this._error = value;
        this.state = State.Error;
    }

    constructor() {
        this.state = State.Initial;
    }

    get controls(): { [key: string]: AbstractControl; } {
        return this.formGroup.controls;
    }

    isValid(key: string): boolean {
        const control = this.controls[key];

        return control.invalid && (control.dirty || control.touched);
    }

    observer(): Observer<TResultModel> {
        const next = (result: TResultModel): void => {
            this.result = result;
            this.state = State.Ok;
        }
        const error = (error: Error): void => {
            this.error = error;
            this.state = State.Error;
        }
        const complete = (): void => {
        }

        return <Observer<TResultModel>>{
            next: next,
            error: error,
            complete: complete
        }
    }
}