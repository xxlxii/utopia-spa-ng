import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ComponentBase } from '../abstract/component.base';

interface ITransferModel {
    accountFrom: FormControl<number | null>;
    accountTo: FormControl<number | null>;
    amount: FormControl<number | null>;
}

@Component({
    selector: 'app-transfer',
    templateUrl: './transfer.component.html'
})
export class TransferComponent extends ComponentBase<ITransferModel, any> implements OnInit {
    constructor(private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        const accountPattern = /^\d{3}$/;
        const amountPattern = /^\d*\.?\d{0,2}$/;

        this.formGroup = this.formBuilder.group<ITransferModel>({
            accountFrom: new FormControl(null, [Validators.required, Validators.pattern(accountPattern)]),
            accountTo: new FormControl(null, [Validators.required, Validators.pattern(accountPattern)]),
            amount: new FormControl(null, [Validators.required, Validators.pattern(amountPattern)])
        });
    }

    onSubmit() {
        const value = this.formGroup.value;

        console.log(`Transfer ${value.amount} from ${value.accountFrom} to ${value.accountTo}`);
    }
}
