import { environment } from '../../environments/environment';
import { DomainError } from "../errors/domain.error";
import { OperationsError } from "../errors/operations.error";
import { throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

export abstract class ServiceBase {
    protected endpoint: string;

    constructor() {
        this.endpoint = environment.endpoint;
    }

    protected handleError(errorResponse: HttpErrorResponse) {
        let status = errorResponse.status;
        let reason: string = errorResponse.error;
        let error: Error;

        if (status >= 400 && status <= 499) {
            error = new DomainError(reason);
        } else if (status >= 500 && status <= 599) {
            error = new OperationsError(reason);
        } else {
            reason = "Login service couldn't be contacted";
            error = new OperationsError(reason);
        }

        return throwError(() => error);
    }
}