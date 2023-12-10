import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';
import { DomainError } from '../errors/domain.error';
import { OperationsError } from '../errors/operations.error';
import { LoginModel } from '../login/login.model';
import { LoginResultModel } from '../login/login.result.model';

describe('LoginService', () => {
	let service: LoginService;
	let controller: HttpTestingController;

	beforeEach(() => {
		const metadata: TestModuleMetadata = {
			imports: [HttpClientTestingModule],
		};

		TestBed.configureTestingModule(metadata);
		controller = TestBed.inject(HttpTestingController);
		service = TestBed.inject(LoginService);
	});

	it('should be created', () => {
		// assert
		expect(service).toBeTruthy();
	});

	it('should succeed', () => {
		// arrange
		const username = 'user00';
		const pin = 1234;
		const model: LoginModel = new LoginModel(username, pin);
		const greet = `Welcome ${model.username}!`;

		// act
		let actual: LoginResultModel | undefined;

		service
			.login(model)
			.subscribe(result => actual = result);

		const url = `${environment.endpoint}/login`;
		const match = { method: 'POST', url: url };
		const response = new LoginResultModel(greet);
		const request = controller.expectOne(match);

		request.flush(response);

		// assert
		const expected: LoginResultModel = response;

		expect(actual).toBe(expected);
	});

	it("should report 'Model not found'", () => {
		// arrange
		const username = 'user00';
		const pin = 1234;
		const model: LoginModel = new LoginModel(username, pin);
		const reason = 'Model not found';

		// act
		let actual: DomainError | undefined;

		service.login(model).subscribe({
			error: (e: Error) => actual = new DomainError(e.message)
		});

		const url = `${environment.endpoint}/login`;
		const match = { method: 'POST', url: url };
		const request = controller.expectOne(match);
		const response = reason;
		const options = { status: 404, statusText: 'Not Found' };

		request.flush(response, options);

		// assert
		const expected = new DomainError(reason);

		expect(actual).toEqual(expected);
	});

	it("should report 'Service unavailable'", () => {
		// arrange
		const username = 'user00';
		const pin = 1234;
		const model: LoginModel = new LoginModel(username, pin);
		const reason = 'Service unavailable';

		// act
		let actual: OperationsError | undefined;

		service.login(model).subscribe({
			error: (e: Error) => actual = new OperationsError(e.message)
		});

		const url = `${environment.endpoint}/login`;
		const match = { method: 'POST', url: url };
		const request = controller.expectOne(match);
		const response = reason;
		const options = { status: 500, statusText: 'Internal Server Error' };

		request.flush(response, options);

		// assert
		const expected = new OperationsError(reason);

		expect(actual).toEqual(expected);
	});
});
