import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../abstract/component.base';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { LoginModel } from './login.model';
import { LoginResultModel } from './login.result.model';
import { LoginService } from '../services/login.service';

interface ILoginModel {
    username: FormControl<string | null>;
    pin: FormControl<number | null>;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent extends ComponentBase<ILoginModel, LoginResultModel> implements OnInit {
    constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
        super();
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group<ILoginModel>({
            username: this.usernameControl(),
            pin: this.pinControl()
        });
    }

    private usernameControl(): FormControl<string | null> {
        const validators = [
            Validators.required,
            Validators.pattern(/^[a-z]{4}[0-9]{2}$/)
        ];

        return new FormControl<string | null>(null, validators);
    }

    private pinControl(): FormControl<number | null> {
        const validators = [
            Validators.required,
            Validators.min(0),
            Validators.max(9999)
        ];

        return new FormControl<number | null>(null, validators);
    }

    onSubmit() {
        const username = <string>this.formGroup.value.username;
        const pin = <number>this.formGroup.value.pin;
        const model = new LoginModel(username, pin);

        this.loginService
            .login(model)
            .pipe(take(1))
            .subscribe(this.observer());
    }
}
