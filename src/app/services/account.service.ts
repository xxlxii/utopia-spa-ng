import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { GetBalanceResultModel } from '../balance/get.balance.result.model';
import { GetBalanceModel } from '../balance/get.balance.model';
import { ServiceBase } from '../abstract/service.base';

@Injectable({
    providedIn: 'root'
})
export class AccountService extends ServiceBase {
    constructor(private httpClient: HttpClient) {
        super();
    }

    public getBalance(model: GetBalanceModel): Observable<GetBalanceResultModel> {
        const account = model.account;
        const url: string = `${environment.endpoint}/account/${account}/balance`;

        return this
            .httpClient
            .get<GetBalanceResultModel>(url)
            .pipe(catchError(this.handleError));
    }
}
