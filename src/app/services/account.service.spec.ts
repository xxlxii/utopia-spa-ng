import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { environment } from '../../environments/environment';
import { DomainError } from '../errors/domain.error';
import { OperationsError } from '../errors/operations.error';
import { GetBalanceModel } from '../balance/get.balance.model';

describe('AccountService', () => {
    let service: AccountService;
    let controller: HttpTestingController;

    beforeEach(() => {
        const metadata: TestModuleMetadata = {
            imports: [HttpClientTestingModule],
        };

        TestBed.configureTestingModule(metadata);
        controller = TestBed.inject(HttpTestingController);
        service = TestBed.inject(AccountService);
    });

    it('should be created', () => {
        // assert
        expect(service).toBeTruthy();
    });

    it('should succeed', () => {
        // arrange
        const model = new GetBalanceModel(123);
        const balance = 1000;

        // act
        let actual: number = 0;

        service
            .getBalance(model)
            .subscribe(result => actual = result.balance || 0);

        const url = `${environment.endpoint}/account/${model.account}/balance`;
        const match = { method: 'GET', url: url };
        const response = { balance: balance };
        const request = controller.expectOne(match);

        request.flush(response);

        // assert
        expect(actual).toEqual(balance);
    });

    it("should report 'Account not found'", () => {
        // arrange
        const model = new GetBalanceModel(999);
        const reason = `Account ${model.account} not found`;

        // act
        let actual: DomainError | undefined;

        service.getBalance(model).subscribe({
            error: (e: Error) => actual = new DomainError(e.message)
        });

        const url = `${environment.endpoint}/account/${model.account}/balance`;
        const match = { method: 'GET', url: url };
        const request = controller.expectOne(match);
        const response = reason;
        const options = { status: 404, statusText: 'Not Found' };

        request.flush(response, options);

        // // assert
        const expected = new DomainError(reason);
        expect(actual).toEqual(expected);
    });

    it("should report 'Service unavailable'", () => {
        // arrange
        const account = 101;
        const model = new GetBalanceModel(account);
        const reason = 'Ooops! It’s not you. It’s us, but we are working on it :)';

        // act
        let actual: OperationsError | undefined;

        service.getBalance(model).subscribe({
            error: (e: Error) => actual = new OperationsError(e.message)
        });

        const url = `${environment.endpoint}/account/${model.account}/balance`;
        const match = { method: 'GET', url: url };
        const request = controller.expectOne(match);
        const response = reason;
        const options = { status: 500, statusText: 'Internal Server Error' };

        request.flush(response, options);

        // assert
        const expected = new OperationsError(reason);
        expect(actual).toEqual(expected);
    });
});
