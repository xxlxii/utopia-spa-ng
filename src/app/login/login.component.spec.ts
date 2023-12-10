import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { LoginService } from '../services/login.service';
import { LoginModel } from './login.model';
import { LoginResultModel } from './login.result.model';
import { DomainError } from '../errors/domain.error';
import { OperationsError } from '../errors/operations.error';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let service: LoginService;

    beforeEach(() => {
        const metadata: TestModuleMetadata = {
            declarations: [LoginComponent],
            imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
            providers: [LoginService]
        };

        TestBed
            .configureTestingModule(metadata)
            .compileComponents();

        service = TestBed.inject(LoginService);
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create LoginComponent', () => {
        // assert
        const actual = component;

        expect(actual).toBeTruthy();
    });

    it("should succeed", (async () => {
        // arrange
        const username = 'user00';
        const pin = 1234;
        const greet = 'hello, world! and to you user00';
        const model = new LoginModel(username, pin);
        const result = new LoginResultModel(greet);
        const usernameControl = component.formGroup.controls['username'];
        const pinControl = component.formGroup.controls['pin'];
        const spy = spyOn(service, 'login').and.returnValue(of(result));

        // act
        usernameControl.setValue(username);
        pinControl.setValue(pin);
        component.onSubmit();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        // assert
        const actual = component.result;
        const expected = result;

        expect(actual).toEqual(expected);
        expect(spy).toHaveBeenCalledWith(model);
    }));

    it("should be a valid form when every control is valid", () => {
        // arrange
        const username = 'user00';
        const pin = 1234;
        const usernameControl = component.formGroup.controls['username'];
        const pinControl = component.formGroup.controls['pin'];

        // act
        usernameControl.setValue(username);
        pinControl.setValue(pin);

        // assert
        const actual = component.formGroup.valid;
        expect(actual).toBeTrue();
    });

    it("should not have a username 'required' error", () => {
        // arrange
        const username = 'user00';
        const usernameControl = component.formGroup.controls['username'];

        // act
        usernameControl.setValue(username);

        // assert
        const errors = usernameControl.errors;
        const actual = errors?.['required'];

        expect(actual).toBeUndefined();
    });

    it("should have a username 'required' error", () => {
        // arrange
        const usernameControl = component.formGroup.controls['username'];

        // act
        usernameControl.setValue(null);

        // assert
        const errors = usernameControl.errors;
        const actual = errors?.['required'];

        expect(actual).toBeDefined();
    });

    it("should not have a username 'pattern' error", () => {
        // arrange
        const username = 'user00';
        const usernameControl = component.formGroup.controls['username'];

        // act
        usernameControl.setValue(username);

        // assert
        const errors = usernameControl.errors;
        const actual = errors?.['pattern'];

        expect(actual).toBeUndefined();
    });

    it("should have a username 'pattern' error", () => {
        // arrange
        const username = 'USER//';
        const usernameControl = component.formGroup.controls['username'];

        // act
        usernameControl.setValue(username);

        // assert
        const errors = usernameControl.errors;
        const actual = errors?.['pattern'];

        expect(actual).toBeDefined();
    });

    it("should show error message when no username value is supplied", () => {
        // arrange
        const usernameControl = component.formGroup.controls['username'];

        // act
        usernameControl.setValue(null);
        usernameControl.markAllAsTouched();
        usernameControl.markAsDirty();
        fixture.detectChanges();

        // assert
        const nativeElement = fixture.nativeElement;
        const element = nativeElement.querySelector('#username-required-error');
        const actual = element.textContent.trim();
        const expected = 'Username is required';

        expect(actual).toEqual(expected);
    });

    it("should show error message when username value has an invalid pattern", () => {
        // arrange
        const usernameControl = component.formGroup.controls['username'];
        const username = 'USER//';

        // act
        usernameControl.setValue(username);
        usernameControl.markAllAsTouched();
        usernameControl.markAsDirty();
        fixture.detectChanges();

        // assert
        const nativeElement = fixture.nativeElement;
        const element = nativeElement.querySelector('#username-pattern-error');
        const actual = element.textContent.trim();
        const expected = 'Username must be four letters and two digits';

        expect(actual).toEqual(expected);
    });

    it("should not have a pin 'required' error", () => {
        // arrange
        const pin = 1234;
        const pinControl = component.formGroup.controls['pin'];

        // act
        pinControl.setValue(pin);

        // assert
        const errors = pinControl.errors;
        const actual = errors?.['required'];

        expect(actual).toBeUndefined();
    });

    it("should have a pin 'required' error", () => {
        // arrange
        const pinControl = component.formGroup.controls['pin'];

        // act
        pinControl.setValue(null);

        // assert
        const errors = pinControl.errors;
        const actual = errors?.['required'];

        expect(actual).toBeTrue();
    });

    it("should have a pin 'min' error", () => {
        // arrange
        const pin = -1;
        const pinControl = component.formGroup.controls['pin'];

        // act
        pinControl.setValue(pin);

        // assert
        const errors = pinControl.errors;
        const actual = errors?.['min'];

        expect(actual).toBeDefined();
    });

    it("should not have a pin 'min' error", () => {
        // arrange
        const pin = 1234;
        const pinControl = component.formGroup.controls['pin'];

        // act
        pinControl.setValue(pin);

        // assert
        const errors = pinControl.errors;
        const actual = errors?.['min'];

        expect(actual).toBeUndefined();
    });

    it("should have a pin 'max' error", () => {
        // arrange
        const pin = 10000;
        const pinControl = component.formGroup.controls['pin'];

        // act
        pinControl.setValue(pin);

        // assert
        const errors = pinControl.errors;
        const actual = errors?.['max'];

        expect(actual).toBeDefined();
    });

    it("should not have a pin 'max' error", () => {
        // arrange
        const pin = 1234;
        const pinControl = component.formGroup.controls['pin'];

        // act
        pinControl.setValue(pin);

        // assert
        const errors = pinControl.errors;
        const actual = errors?.['max'];

        expect(actual).toBeUndefined();
    });

    it("should show error message when no pin value is supplied", () => {
        // arrange
        const pinControl = component.formGroup.controls['pin'];

        // act
        pinControl.setValue(null);
        pinControl.markAllAsTouched();
        pinControl.markAsDirty();
        fixture.detectChanges();

        // assert
        const nativeElement = fixture.nativeElement;
        const element = nativeElement.querySelector('#pin-required-error');
        const actual = element.textContent.trim();
        const expected = 'PIN is required';

        expect(actual).toEqual(expected);
    });

    it("should show error message when pin value is less than min", () => {
        // arrange
        const pinControl = component.formGroup.controls['pin'];
        const pin = -1;

        // act
        pinControl.setValue(pin);
        pinControl.markAllAsTouched();
        pinControl.markAsDirty();
        fixture.detectChanges();

        // assert
        const nativeElement = fixture.nativeElement;
        const element = nativeElement.querySelector('#pin-min-error');
        const actual = element.textContent.trim();
        const expected = 'PIN must be equal or greater than 0';

        expect(actual).toEqual(expected);
    });

    it("should show error message when pin value is greater than max", () => {
        // arrange
        const pinControl = component.formGroup.controls['pin'];
        const pin = 10000;

        // act
        pinControl.setValue(pin);
        pinControl.markAllAsTouched();
        pinControl.markAsDirty();
        fixture.detectChanges();

        // assert
        const nativeElement = fixture.nativeElement;
        const element = nativeElement.querySelector('#pin-max-error');
        const actual = element.textContent.trim();
        const expected = 'PIN must be less or equal to 9999';

        expect(actual).toEqual(expected);
    });

    it("should report 'Model not found' error", (async () => {
        // arrange
        const username = 'user00';
        const pin = 1234;
        const model = new LoginModel(username, pin);
        const reason = `Model not found`;
        const error = new DomainError(reason);
        const spy = spyOn(service, 'login').and.returnValue(throwError(() => error));

        // act
        component.formGroup.setValue({
            username: model.username,
            pin: model.pin
        });
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

    it("should report 'Service unreachable' error", (async () => {
        // arrange
        const username = 'user00';
        const pin = 1234;
        const model = new LoginModel(username, pin);
        const reason = 'Service unreachable';
        const error = new OperationsError(reason);
        const spy = spyOn(service, 'login').and.returnValue(throwError(() => error));

        // act
        component.formGroup.setValue({
            username: model.username,
            pin: model.pin
        });
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
