import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TokenResponse } from '@app/@openapi/auth';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../service/authentication.service';
import { CurrentAccountService } from '../service/current-account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  private tokenResponse: TokenResponse;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private currentAccountService: CurrentAccountService
  ) {
    this.authenticationService.tokenResponse$.subscribe((tokenResponse) => {
      this.tokenResponse = tokenResponse;
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.tokenResponse || !this.tokenResponse.token || !this.tokenResponse.verified) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return of(false);
    }

    return of(true);
  }
}
