import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BalanceComponent } from './balance.component';
import { AccountService } from '../services/account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { GetBalanceResultModel } from './get.balance.result.model';
import { GetBalanceModel } from './get.balance.model';
import { DomainError } from '../errors/domain.error';
import { OperationsError } from '../errors/operations.error';

describe("BalanceComponent", () => {
    let component: BalanceComponent;
    let fixture: ComponentFixture<BalanceComponent>;
    let service: AccountService;

    beforeEach((async () => {
        const metadata: TestModuleMetadata = {
            declarations: [BalanceComponent],
            imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
            providers: [AccountService]
        };

        TestBed
            .configureTestingModule(metadata)
            .compileComponents();

        service = TestBed.inject(AccountService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BalanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create BalanceComponent", () => {
        // assert
        const actual = component;

        expect(actual).toBeTruthy();
    });

    it("should succeed", (async () => {
        // arrange
        const account = 123;
        const balance = 1000;
        const model = new GetBalanceModel(account);
        const result = new GetBalanceResultModel(balance);
        const spy = spyOn(service, 'getBalance').and.returnValue(of(result));
        const accountControl = component.formGroup.controls['account'];

        // act
        accountControl.setValue(account);
        component.onSubmit();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        // assert
        const actual = component.result?.balance;
        const expected = balance;

        expect(actual).toEqual(expected);
        expect(spy).toHaveBeenCalledWith(model);
    }));

    it("should be a valid form when account value is in the expected format", () => {
        const accountControl = component.formGroup.controls['account'];
        const account = 123;

        // act
        accountControl.setValue(account);

        // assert
        const actual = component.formGroup.valid;

        expect(actual).toBeTrue();
    });

    it("should be an invalid form when account is empty", () => {
        // assert
        const actual = component.formGroup.valid;

        expect(actual).toBeFalse();
    });

    it("should not have a 'required' error when account value is supplied", () => {
        // arrange
        const accountControl = component.formGroup.controls['account'];
        const account = 123;

        // act
        accountControl.setValue(account);

        // assert
        const errors = accountControl.errors || {};
        const actual = errors['required'];

        expect(actual).toBeUndefined();
    });

    it("should show error message when no account value is supplied", () => {
        // arrange
        const accountControl = component.formGroup.controls['account'];

        // act
        accountControl.setValue(null);
        accountControl.markAsTouched();
        accountControl.markAsDirty();
        fixture.detectChanges();

        // assert
        const nativeElement = fixture.nativeElement;
        const element = nativeElement.querySelector('#account-required-error');
        const actual = element.textContent.trim();
        const expected = 'El número de cuenta es un dato obligatorio';

        expect(actual).toEqual(expected);
    });

    it("should be an invalid control when account value is not three digits long", () => {
        // arrange
        const accountControl = component.formGroup.controls['account'];
        const accounts = [1, 12, 1234];
        let valid = false;

        // act
        for (let i = 0; i < accounts.length; i++) {
            accountControl.setValue(accounts[i]);
            valid = valid || accountControl.valid;
        }

        // assert
        const actual = valid;

        expect(actual).toBeFalse();
    });

    it("should be a valid control when account value is three digits long", () => {
        // arrange
        const accountControl = component.formGroup.controls['account'];
        const account = 123;

        // act
        accountControl.setValue(account);

        // assert
        const errors = accountControl.errors || {};
        const actual = errors['pattern'];

        expect(actual).toBeUndefined();
    });

    it("should show error message when account value is one digit long", () => {
        // arrange
        const accountControl = component.formGroup.controls['account'];
        const account = 1;

        // act
        accountControl.setValue(account);
        fixture.detectChanges();

        // assert
        const nativeElement = fixture.nativeElement;
        const element = nativeElement.querySelector('#account-pattern-error');
        const actual = element.textContent.trim();
        const expected = 'El número de cuenta debe ser de tres dígitos';

        expect(actual).toEqual(expected);
    });

    it("should report 'Account not found' error", (async () => {
        // arrange
        const account = 999;
        const model = new GetBalanceModel(account);
        const reason = `Account ${account} not found`;
        const error = new DomainError(reason);
        const spy = spyOn(service, 'getBalance').and.returnValue(throwError(() => error));
        const accountControl = component.formGroup.controls['account'];

        // act
        accountControl.setValue(account);
        component.onSubmit();

        // assert
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        const element = nativeElement.querySelector('#error');
        const actual = element.value;
        const expected = reason;

        expect(actual).toEqual(expected);
        expect(spy).toHaveBeenCalledWith(model);
    }));

    it("should report 'Account services couldn't be contacted' error", (async () => {
        // arrange
        const account = 101;
        const model = new GetBalanceModel(account);
        const reason = "Account services couldn't be contacted";
        const error = new OperationsError(reason);
        const spy = spyOn(service, 'getBalance').and.returnValue(throwError(() => error));
        const accountControl = component.formGroup.controls['account'];

        // act
        accountControl.setValue(account);
        component.onSubmit();

        // assert
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        const element = nativeElement.querySelector('#error');
        const actual = element.value;
        const expected = reason;

        expect(actual).toEqual(expected);
        expect(spy).toHaveBeenCalledWith(model);
    }));
});
