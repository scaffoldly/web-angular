import { Injectable } from '@angular/core';
import { AccountRequest, AccountResponse, AccountService, UpdateAccountRequest } from '@app/@openapi/auth';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentAccountService {
  private account$: BehaviorSubject<AccountResponse> = new BehaviorSubject(null);

  constructor(private authenticationService: AuthenticationService, private accountService: AccountService) {
    this.authenticationService.tokenResponse$.subscribe((tokenResponse) => {
      if (!tokenResponse || !tokenResponse.token || !tokenResponse.verified) {
        this.account$.next(null);
        return;
      }

      this.accountService.getMyAccount().subscribe(
        (accountResponse) => {
          this.setAccountResponse(accountResponse);
        },
        () => {
          this.setAccountResponse(null);
        }
      );
    });
  }

  private setAccountResponse(accountResponse: AccountResponse): AccountResponse {
    if (accountResponse && accountResponse.id === this.authenticationService.id) {
      this.account$.next(accountResponse);
    }
    return accountResponse;
  }

  create = (accountRequest: AccountRequest): Observable<AccountResponse> => {
    return this.accountService
      .createAccount(accountRequest)
      .pipe(map((accountResponse) => this.setAccountResponse(accountResponse)));
  };

  update = (updateAccountRequest: UpdateAccountRequest): Observable<AccountResponse> => {
    return this.accountService
      .updateAccount(updateAccountRequest)
      .pipe(map((accountResponse) => this.setAccountResponse(accountResponse)));
  };

  fetch = (): Observable<AccountResponse> => {
    return this.accountService.getMyAccount().pipe(map((accountResponse) => this.setAccountResponse(accountResponse)));
  };

  get = (): Observable<AccountResponse> => {
    if (!this.account$.value) {
      this.fetch();
    }
    return this.account$.asObservable();
  };
}
