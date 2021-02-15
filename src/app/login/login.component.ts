import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '@core';
import { AuthenticationService } from '../@shared/service/authentication.service';
import { GoogleLoginProvider } from 'angularx-social-login';
import { throwError } from 'rxjs';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  error: string | undefined;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  googleLogin() {
    this.loading = true;
    this.authenticationService.socialLogin(GoogleLoginProvider.PROVIDER_ID).subscribe((credential) => {
      log.debug(`${credential.payload.id} successfully logged in`);
      this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
    });
  }
}
