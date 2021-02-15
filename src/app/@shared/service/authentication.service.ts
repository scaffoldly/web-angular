import { Injectable } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { Observable, of, from } from 'rxjs';

import { CredentialsService } from './credentials.service';
import { AccountService } from './account.service';
import { map, mergeMap } from 'rxjs/operators';
import { Credential } from '../interfaces/credential';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private credentialsService: CredentialsService,
    private socialAuthService: SocialAuthService,
    private accountService: AccountService
  ) {}

  socialLogin(providerId: string): Observable<Credential> {
    return from(this.socialAuthService.signIn(providerId))
      .pipe(mergeMap((socialUser) => this.accountService.login(socialUser)))
      .pipe(map((credential) => this.credentialsService.setCredential(credential, true)));
  }

  deleteSocialLogin(providerId: string): Observable<Credential> {
    return this.accountService
      .deleteLogin(providerId)
      .pipe(map((credential) => this.credentialsService.setCredential(credential, true)));
  }

  refresh(): Observable<Credential> {
    const { credential } = this.credentialsService;
    return this.accountService
      .refresh(credential)
      .pipe(map((credential) => this.credentialsService.setCredential(credential, true)));
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    this.credentialsService.setCredential();
    this.socialAuthService.signOut(false);
    return of(true);
  }
}
