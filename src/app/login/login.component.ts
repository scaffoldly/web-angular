import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '@core';
import { AuthenticationService } from '../@shared/service/authentication.service';
import { Email } from '@app/@shared/email-login/email-login.component';
import CoreError from '@app/@core/core-error';
import { AccountService, JwtService, ProviderResponse, VerificationMethod } from '@app/@openapi/auth';

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
  providers: ProviderResponse;
  separator = false;

  verificationMethod: VerificationMethod;
  email: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private jwtService: JwtService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.jwtService.getProviders().subscribe((providers) => {
      this.loading = false;
      this.providers = providers;
      this.separator = !providers.EMAIL.enabled;
    });
  }

  ngOnDestroy() {}

  reset() {
    this.loading = false;
    this.error = null;
    this.verificationMethod = null;
    this.email = null;
  }

  googleLogin() {
    this.loading = true;
    this.authenticationService
      .socialLogin('GOOGLE')
      .pipe(mergeMap((loginResponse) => this.accountService.getAccountById(loginResponse.id)))
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
          this.email = email;
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
    this.authenticationService
      .emailLogin(this.email, code)
      .pipe(mergeMap(() => this.accountService.getMyAccount()))
      .subscribe(
        (account) => {
          log.debug(`${account.id} successfully logged in`);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error: CoreError) => {
          if (error.code === 404) {
            log.debug(`${this.email} successfully logged in, but an account needs to be created`);
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/signup'], { replaceUrl: true });
            return;
          }
          this.loading = false;
          this.email = null;
          this.error = error.message;
        }
      );
  }
}
