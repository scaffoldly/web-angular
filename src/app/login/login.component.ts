import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize, map, mergeMap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '@core';
import { AuthenticationService } from '../@shared/service/authentication.service';
import { GoogleLoginProvider } from 'angularx-social-login';
import { throwError } from 'rxjs';
import { Providers } from '@app/@shared/interfaces/providers';
import { AccountService } from '@app/@shared/service/account.service';
import { Email } from '@app/@shared/email-login/email-login.component';
import { LoginResponse, VerificationMethod } from '@app/@shared/interfaces/authentication';
import CoreError from '@app/@core/core-error';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  appName: string = environment.envVars['APPLICATION_FRIENDLY_NAME'];
  error: string | undefined;
  loading = true;
  providers: Providers;
  separator = false;

  verificationMethod: VerificationMethod;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.authenticationService.providers.subscribe((providers) => {
      this.loading = false;
      this.providers = providers;
      if (providers && Object.keys(providers).length > 1) {
        this.separator = true;
      }
    });
  }

  ngOnDestroy() {}

  reset() {
    this.loading = false;
    this.verificationMethod = null;
    this.error = null;
  }

  googleLogin() {
    this.loading = true;
    this.authenticationService
      .socialLogin(GoogleLoginProvider.PROVIDER_ID)
      .pipe(mergeMap((loginResponse) => this.accountService.getAccount(loginResponse.id)))
      .subscribe(
        (account) => {
          log.debug(`${account.id} successfully logged in`);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error: CoreError) => {
          if (error.code === 404) {
            log.debug(`Successfully logged in, but an account needs to be created`);
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/signup'], { replaceUrl: true });
            return;
          }
          this.loading = false;
          this.error = error.message;
        }
      );
  }

  emailLogin(email: Email) {
    this.loading = true;
    this.authenticationService.emailLogin(email).subscribe(
      (loginResponse) => {
        if (loginResponse && !loginResponse.verified) {
          this.loading = false;
          this.verificationMethod = loginResponse.verificationMethod;
          this.error = null;
        }
      },
      (error) => {
        this.loading = false;
        this.error = error.message;
      }
    );
  }

  verifyCode(code: string) {
    this.loading = true;
    const { id } = this.authenticationService;
    if (!id) {
      throw new Error('ID is not set');
    }

    this.authenticationService
      .emailLogin(id, code)
      .pipe(mergeMap((loginResponse) => this.accountService.getAccount(loginResponse.id)))
      .subscribe(
        (account) => {
          log.debug(`${account.id} successfully logged in`);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error: CoreError) => {
          if (error.code === 404) {
            log.debug(`${id} successfully logged in, but an account needs to be created`);
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/signup'], { replaceUrl: true });
            return;
          }
          this.loading = false;
          this.error = error.message;
        }
      );
  }
}
