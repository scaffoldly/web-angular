import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  AsyncSubject,
  BehaviorSubject,
  CompletionObserver,
  ErrorObserver,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Account } from '../interfaces/account';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private currentAccount$: BehaviorSubject<Account> = new BehaviorSubject(null);

  baseUrl = environment.serviceUrls['sly-auth-api'];

  constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService) {
    this.authenticationService.loginResponse$.subscribe((loginResponse) => {
      if (!loginResponse || !loginResponse.token || !loginResponse.verified) {
        this.setAccount(null);
        return;
      }

      this.getAccount(loginResponse.id).subscribe(
        (account) => {},
        (error) => {}
      );
    });
  }

  private setAccount(account: Account) {
    if (account && account.id === this.authenticationService.id) {
      this.currentAccount$.next(account);
    }
    return account;
  }

  createAccount = (account: { email: string; name: string; company?: string }): Observable<Account> => {
    return this.httpClient.post(`${this.baseUrl}/api/v1/account`, account).pipe(
      map((account: Account) => {
        return this.setAccount(account);
      })
    );
  };

  updateAccount = (id: string, account: { name?: string; company?: string }): Observable<Account> => {
    return this.httpClient.patch(`${this.baseUrl}/api/v1/account/${id}`, account).pipe(
      map((account: Account) => {
        return this.setAccount(account);
      })
    );
  };

  getAccount = (id: string): Observable<Account> => {
    return this.httpClient.get(`${this.baseUrl}/api/v1/account/${id}`).pipe(
      map((account: Account) => {
        return this.setAccount(account);
      })
    );
  };

  getCurrentAccount = (): Observable<Account> => {
    return this.currentAccount$.asObservable();
  };
}
