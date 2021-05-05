import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import {
  Observable,
  of,
  from,
  throwError,
  BehaviorSubject,
  ErrorObserver,
  CompletionObserver,
  AsyncSubject,
  merge,
  Subject,
} from 'rxjs';

import { map, mergeMap } from 'rxjs/operators';
import { EmailLoginRequest, LoginPayload, LoginResponse, SocialLoginRequest } from '../interfaces/authentication';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Providers } from '../interfaces/providers';
import { Email } from '../email-login/email-login.component';

export const loginResponseKey = 'loginResponse';
export const refreshHeader = 'X-Auth-Refresh';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private loginResponse: LoginResponse;
  public readonly loginResponse$: BehaviorSubject<LoginResponse> = new BehaviorSubject(null);

  private baseUrl = environment.serviceUrls['sly-auth-api'];

  constructor(private httpClient: HttpClient, private socialAuthService: SocialAuthService) {
    this.loginResponse$.subscribe((loginResponse) => {
      this.loginResponse = loginResponse;
    });

    const savedLoginResponse = sessionStorage.getItem(loginResponseKey) || localStorage.getItem(loginResponseKey);
    if (savedLoginResponse) {
      this.setLoginResponse(JSON.parse(savedLoginResponse));
    }
  }

  get authenticated(): boolean {
    return this.loginResponse && this.loginResponse.token && this.loginResponse.verified;
  }

  get id(): string | null {
    return this.loginResponse && this.loginResponse.id;
  }

  get token(): string | null {
    return this.loginResponse && this.loginResponse.token;
  }

  get payload(): LoginPayload | null {
    return this.loginResponse && this.loginResponse.payload;
  }

  public get providers(): Observable<Providers> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/login/providers`).pipe(
      map((body: Providers) => {
        return body;
      })
    );
  }

  // TODO: fix this in the backend
  public get logins(): Observable<{ [key: string]: LoginPayload }> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/login`).pipe(
      map((body: { [key: string]: LoginPayload }) => {
        return body;
      })
    );
  }

  socialLogin(providerId: string): Observable<LoginResponse> {
    return from(this.socialAuthService.signIn(providerId))
      .pipe(mergeMap((socialUser) => this.login(socialUser)))
      .pipe(mergeMap((loginResponse) => this.setLoginResponse(loginResponse, true)));
  }

  emailLogin(email: Email, code?: string): Observable<LoginResponse> {
    return this.login(new EmailLoginRequest(email, code)).pipe(
      mergeMap((loginResponse) => this.setLoginResponse(loginResponse, code ? true : false))
    );
  }

  refresh(): Observable<LoginResponse> {
    if (!this.payload) {
      console.warn('Payload missing from authentication context');
      return this.setLoginResponse();
    }

    const { refreshUrl } = this.payload;
    if (!refreshUrl) {
      console.warn('Refresh URL missing from authentication context');
      return this.setLoginResponse();
    }

    return this.httpClient.post(refreshUrl, {}, { withCredentials: true, headers: { [refreshHeader]: 'true' } }).pipe(
      mergeMap((body: LoginResponse) => {
        return this.setLoginResponse(body, true);
      })
    );
  }

  logout(): Observable<boolean> {
    return from(this.socialAuthService.signOut().catch(() => {}))
      .pipe(mergeMap(() => this.setLoginResponse()))
      .pipe(
        map(() => {
          return true;
        })
      );
  }

  private login(request: SocialLoginRequest | EmailLoginRequest): Observable<LoginResponse> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/login`, request, { withCredentials: true }).pipe(
      map((body: LoginResponse) => {
        return body;
      })
    );
  }

  private setLoginResponse(loginResponse?: LoginResponse, remember?: boolean): Observable<LoginResponse> {
    sessionStorage.removeItem(loginResponseKey);
    localStorage.removeItem(loginResponseKey);

    if (loginResponse) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(loginResponseKey, JSON.stringify(loginResponse));
      this.loginResponse$.next(loginResponse);
    } else {
      this.loginResponse$.next(null);
    }

    return this.loginResponse$.asObservable();
  }
}
