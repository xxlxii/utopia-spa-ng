import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServiceBase } from '../abstract/service.base';
import { LoginModel } from '../login/login.model';
import { LoginResultModel } from '../login/login.result.model';

@Injectable({
    providedIn: 'root'
})
export class LoginService extends ServiceBase {
    constructor(private httpClient: HttpClient) {
        super();
    }

    public login(model: LoginModel): Observable<LoginResultModel> {
        const url: string = `${this.endpoint}/login`;

        return this
            .httpClient
            .post<LoginResultModel>(url, model)
            .pipe(catchError(this.handleError));
    }
}
