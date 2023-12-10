import { waitForAsync, ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TransferComponent } from './transfer.component';

describe('TransferComponent', () => {
    let component: TransferComponent;
    let fixture: ComponentFixture<TransferComponent>;

    beforeEach(waitForAsync(() => {
        const metadata: TestModuleMetadata = {
            declarations: [TransferComponent],
            imports: [FormsModule, ReactiveFormsModule, RouterTestingModule]
        };

        TestBed
            .configureTestingModule(metadata)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TransferComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create TransferComponent', () => {
        // assert
        const actual = component;

        expect(actual).toBeTruthy();
    });

    it('should be invalid when the form is empty', () => {
        // assert
        const actual = component.formGroup.valid;

        expect(actual).toBeFalsy();
    });

    it("should not have a 'required' error when accountFrom value is supplied", () => {
        // arrange
        const accountFromValue = 123;
        const accountFromControl = component.formGroup.controls['accountFrom'];

        // act
        accountFromControl.setValue(accountFromValue);

        // assert
        const errors = accountFromControl.errors || {};
        const actual = errors['required'];

        expect(actual).toBeUndefined();
    });

    it("should not show error message when accountFrom value is supplied", () => {
        // arrange
        const accountFromValue = 123;
        const accountFromControl = component.formGroup.controls['accountFrom'];

        // act
        accountFromControl.setValue(accountFromValue);
        accountFromControl.markAsTouched();
        fixture.detectChanges();

        // assert
        const element = fixture.nativeElement;
        const actual = element.querySelector('#account-from-errors');

        expect(actual).toBeNull();
    });

    it("should show error message when no accountFrom value is supplied", () => {
        // arrange
        const accountFromControl = component.formGroup.controls['accountFrom'];

        // act
        accountFromControl.setValue(null);
        accountFromControl.markAsTouched();
        fixture.detectChanges();

        // assert
        const element = fixture.nativeElement;
        const div = element.querySelector('#account-from-required-error');
        const actual = div.textContent.trim();
        const expected = 'La cuenta origen es un dato obligatorio';

        expect(expected).toEqual(actual);
    });

    it("should be an invalid control when accountFrom value is not three digits long", () => {
        // arrange
        const accountFromValues = [1, 12, 1234];
        let accountFromControl = component.formGroup.controls['accountFrom'];
        let valid = false;

        // act
        for (let i = 0; i < accountFromValues.length; i++) {
            accountFromControl.setValue(accountFromValues[i]);
            valid = valid || accountFromControl.valid;
        }

        // assert
        const actual = valid;

        expect(actual).toBeFalse();
    });

    it("should be a valid control when accountFrom value is three digits long", () => {
        // arrange
        const accountFromValue = 123;
        const accountFromControl = component.formGroup.controls['accountFrom'];

        // act
        accountFromControl.setValue(accountFromValue);

        // assert
        const errors = accountFromControl.errors || {};
        const actual = errors['pattern'];

        expect(actual).toBeUndefined();
    });

    it("should show error message when accountFrom value is one digit long", () => {
        // arrange
        const accountFromValue = 1;
        const accountFromControl = component.formGroup.controls['accountFrom'];

        // act
        accountFromControl.setValue(accountFromValue);
        accountFromControl.markAsTouched();
        fixture.detectChanges();

        // assert
        const element = fixture.nativeElement;
        const div = element.querySelector('#account-from-pattern-error');
        const actual = div.textContent.trim();
        const expected = 'La cuenta origen debe ser de tres dígitos';

        expect(expected).toEqual(actual);
    });

    it("should not have a 'required' error when accountTo value is supplied", () => {
        // arrange
        const accountToValue = 123;
        const accountToControl = component.formGroup.controls['accountTo'];

        // act
        accountToControl.setValue(accountToValue);

        // assert
        const errors = accountToControl.errors || {};
        const actual = errors['required'];

        expect(actual).toBeUndefined();
    });

    it("should show error message when no accountTo value is supplied", () => {
        // arrange
        const accountToControl = component.formGroup.controls['accountTo'];

        // act
        accountToControl.setValue(null);
        accountToControl.markAsTouched();
        fixture.detectChanges();

        // assert
        const element = fixture.nativeElement;
        const div = element.querySelector('#account-to-required-error');
        const actual = div.textContent.trim();
        const expected = 'La cuenta destino es un dato obligatorio';

        expect(expected).toEqual(actual);
    });

    it("should be an invalid control when accountTo value is not three digits long", () => {
        // arrange
        const accountToValues = [1, 12, 1234];
        let accountToControl = component.formGroup.controls['accountTo'];
        let valid = false;

        // act
        for (let i = 0; i < accountToValues.length; i++) {
            accountToControl.setValue(accountToValues[i]);
            valid = valid || accountToControl.valid;
        }

        // assert
        const actual = valid;

        expect(actual).toBeFalse();
    });

    it("should be a valid control when accountTo value is three digits long", () => {
        // arrange
        const accountToValue = 123;
        const accountToControl = component.formGroup.controls['accountTo'];

        // act
        accountToControl.setValue(accountToValue);

        // assert
        const errors = accountToControl.errors || {};
        const actual = errors['pattern'];

        expect(actual).toBeUndefined();
    });

    it("should show error message when accountTo value is one digit long", () => {
        // arrange
        const accountToValue = 1;
        const accountToControl = component.formGroup.controls['accountTo'];

        // act
        accountToControl.setValue(accountToValue);
        accountToControl.markAsTouched();
        fixture.detectChanges();

        // assert
        const element = fixture.nativeElement;
        const div = element.querySelector('#account-to-pattern-error');
        const actual = div.textContent.trim();
        const expected = 'La cuenta destino debe ser de tres dígitos';

        expect(expected).toEqual(actual);
    });

    it("should not have a 'required' error when amount value is supplied", () => {
        // arrange
        const amountValue = 12345678.90;
        const amountControl = component.formGroup.controls['amount'];

        // act
        amountControl.setValue(amountValue);

        // assert
        const errors = amountControl.errors || {};
        const actual = errors['required'];

        expect(actual).toBeUndefined();
    });

    it("should not show any error message when amount is valid", () => {
        // arrange
        const amountValue = 12345678.90;
        const amountControl = component.formGroup.controls['amount'];

        // act
        amountControl.setValue(amountValue);
        amountControl.markAsTouched();
        fixture.detectChanges();

        // assert
        const element = fixture.nativeElement;
        const actual = element.querySelector('#amount-errors');

        expect(actual).toBeNull();
    });

    it("should show error message when no amount value is supplied", () => {
        // arrange
        const amountControl = component.formGroup.controls['amount'];

        // act
        amountControl.setValue(null);
        amountControl.markAsTouched();
        fixture.detectChanges();

        // assert
        const element = fixture.nativeElement;
        const div = element.querySelector('#amount-required-error');
        const actual = div.textContent.trim();
        const expected = 'El monto a transferir es un dato obligatorio';

        expect(expected).toEqual(actual);
    });

    it("should not have a 'pattern' error with valid amount values", () => {
        // arrange
        const amountValues = [.12, 0.12, 12.34, 12345678.90];
        let amountControl = component.formGroup.controls['amount'];
        let valid = true;
        let errors: ValidationErrors;

        // act
        for (let i = 0; i < amountValues.length; i++) {
            amountControl.setValue(amountValues[i]);
            errors = amountControl.errors || {};
            valid = valid && (errors['pattern'] === undefined);
        }

        // assert
        const actual = valid;

        expect(actual).toBeTrue();
    });

    it("should show error message when amount value starts with -", () => {
        // arrange
        const amountValue = -1;
        const amountControl = component.formGroup.controls['amount'];

        // act
        amountControl.setValue(amountValue);
        amountControl.markAsTouched();
        fixture.detectChanges();

        // assert
        const element = fixture.nativeElement;
        const div = element.querySelector('#amount-pattern-error');
        const actual = div.textContent.trim();
        const expected = 'El monto a transferir tiene un formato incorrecto';

        expect(expected).toEqual(actual);
    });

    it("should show error message when amount value has three fractional digits", () => {
        // arrange
        const amountValue = 1.234;
        const amountControl = component.formGroup.controls['amount'];

        // act
        amountControl.setValue(amountValue);
        amountControl.markAsTouched();
        fixture.detectChanges();

        // assert
        const element = fixture.nativeElement;
        const div = element.querySelector('#amount-pattern-error');
        const actual = div.textContent.trim();
        const expected = 'El monto a transferir tiene un formato incorrecto';

        expect(expected).toEqual(actual);
    });
});
