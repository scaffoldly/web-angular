import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { SocialUser } from 'angularx-social-login';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Credential, Payload } from '../interfaces/credential';
import { Account } from '../interfaces/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.serviceUrls['sly-auth-api'];

  constructor(private httpClient: HttpClient) {}

  login(socialUser: SocialUser): Observable<Credential> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/login`, socialUser, { withCredentials: true }).pipe(
      map((body: Credential) => {
        return body;
      })
    );
  }

  deleteLogin(provider: string): Observable<Credential> {
    return this.httpClient.delete(`${this.baseUrl}/api/v1/login?provider=${provider}`, { withCredentials: true }).pipe(
      map((body: Credential) => {
        return body;
      })
    );
  }

  refresh(credential: Credential): Observable<Credential> {
    const { payload } = credential;
    const { refreshUrl } = payload;

    return this.httpClient.post(refreshUrl, {}, { withCredentials: true }).pipe(
      map((body: Credential) => {
        return body;
      })
    );
  }

  getLogins(): Observable<{ [key: string]: Payload }> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/login`).pipe(
      map((body: { [key: string]: Payload }) => {
        return body;
      })
    );
  }

  createAccount(account: { email: string; name: string; company?: string }): Observable<Account> {
    return this.httpClient.post(`${this.baseUrl}/api/v1`, account).pipe(
      map((body: Account) => {
        return body;
      })
    );
  }

  updateAccount(account: { name?: string; company?: string }): Observable<Account> {
    return this.httpClient.patch(`${this.baseUrl}/api/v1`, account).pipe(
      map((body: Account) => {
        return body;
      })
    );
  }

  getAccount(): Observable<Account> {
    return this.httpClient.get(`${this.baseUrl}/api/v1`).pipe(
      map((body: Account) => {
        return body;
      })
    );
  }
}
