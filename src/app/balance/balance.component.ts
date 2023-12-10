import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ComponentBase, State } from '../abstract/component.base';
import { AccountService } from '../services/account.service';
import { GetBalanceResultModel } from './get.balance.result.model';
import { GetBalanceModel } from './get.balance.model';
import { take } from 'rxjs';

interface IBalanceModel {
    account: FormControl<number | null>;
}

@Component({
    selector: 'app-balance',
    templateUrl: './balance.component.html'
})
export class BalanceComponent extends ComponentBase<IBalanceModel, GetBalanceResultModel> implements OnInit {
    constructor(private formBuilder: FormBuilder, private accountService: AccountService) {
        super();
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group<IBalanceModel>({
            account: this.accountControl(),
        });
    }

    accountControl(): FormControl<number | null> {
        const validators = [
            Validators.required,
            Validators.pattern(/^\d{3}$/)
        ];

        return new FormControl(null, validators);
    }

    onSubmit() {
        const account = <number>this.formGroup.value.account;
        const model = new GetBalanceModel(account);

        this.accountService
            .getBalance(model)
            .pipe(take(1))
            .subscribe(this.observer());
    }

    reset() {
        this.formGroup.reset();
        this.result = null;
        this.error = undefined;
        this.state = State.Initial;
    }
}
