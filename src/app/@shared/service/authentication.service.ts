import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Observable, from, BehaviorSubject } from 'rxjs';

import { map, mergeMap } from 'rxjs/operators';
import { Email } from '../email-login/email-login.component';
import CoreError from '@app/@core/core-error';
import { JwtPayload, JwtService, Provider, TokenResponse } from '@app/@openapi/auth';

export const tokenResponseKey = 'token';
export const refreshHeader = 'X-Auth-Refresh';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenResponse: TokenResponse;
  public readonly tokenResponse$: BehaviorSubject<TokenResponse> = new BehaviorSubject(null);

  constructor(private socialAuthService: SocialAuthService, private jwtService: JwtService) {
    this.tokenResponse$.subscribe((tokenResponse) => {
      this.tokenResponse = tokenResponse;
    });

    const tokenResponse = sessionStorage.getItem(tokenResponseKey) || localStorage.getItem(tokenResponseKey);
    if (tokenResponse) {
      this.setTokenResponse(JSON.parse(tokenResponse));
    }
  }

  get authenticated(): boolean {
    return this.tokenResponse && this.tokenResponse.token && this.tokenResponse.verified;
  }

  get id(): string | null {
    return this.tokenResponse && this.tokenResponse.id;
  }

  get email(): string | null {
    return this.tokenResponse && this.tokenResponse.email;
  }

  get name(): string | null {
    return this.tokenResponse && this.tokenResponse.name;
  }

  get photoUrl(): string | null {
    return this.tokenResponse && this.tokenResponse.photoUrl;
  }

  get token(): string | null {
    return this.tokenResponse && this.tokenResponse.token;
  }

  get payload(): JwtPayload | null {
    return this.tokenResponse && this.tokenResponse.payload;
  }

  socialLogin(provider: Provider): Observable<TokenResponse> {
    return from(this.socialAuthService.signIn(provider))
      .pipe(
        mergeMap((socialUser) => {
          switch (provider) {
            case 'GOOGLE':
              return this.jwtService.googleLogin({
                provider: 'GOOGLE',
                id: socialUser.id,
                authToken: socialUser.authToken,
                idToken: socialUser.idToken,
                email: socialUser.email,
                name: socialUser.name,
                photoUrl: socialUser.photoUrl,
              });
            default:
              throw new CoreError(`Unknown provider: ${provider}`);
          }
        })
      )
      .pipe(mergeMap((tokenResponse) => this.setTokenResponse(tokenResponse, true)));
  }

  emailLogin(email: Email, code?: string): Observable<TokenResponse> {
    return this.jwtService
      .emailLogin({ provider: 'EMAIL', email, code })
      .pipe(mergeMap((tokenResponse) => this.setTokenResponse(tokenResponse, code ? true : false)));
  }

  refresh(): Observable<TokenResponse> {
    if (!this.payload) {
      console.warn('Payload missing from authentication context');
      return this.setTokenResponse();
    }

    const { refreshUrl } = this.payload;
    if (!refreshUrl) {
      console.warn('Refresh URL missing from authentication context');
      return this.setTokenResponse();
    }

    this.jwtService.configuration.withCredentials = true;
    return this.jwtService.refresh(this.token).pipe(
      mergeMap((tokenResponse) => {
        this.jwtService.configuration.withCredentials = true;
        return this.setTokenResponse(tokenResponse);
      })
    );
  }

  logout(): Observable<boolean> {
    return from(this.socialAuthService.signOut().catch(() => {}))
      .pipe(mergeMap(() => this.setTokenResponse()))
      .pipe(
        map(() => {
          return true;
        })
      );
  }

  private setTokenResponse(tokenResponse?: TokenResponse, remember?: boolean): Observable<TokenResponse> {
    sessionStorage.removeItem(tokenResponseKey);
    localStorage.removeItem(tokenResponseKey);

    if (tokenResponse) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(tokenResponseKey, JSON.stringify(tokenResponse));
      this.tokenResponse$.next(tokenResponse);
    } else {
      this.tokenResponse$.next(null);
    }

    return this.tokenResponse$.asObservable();
  }
}
