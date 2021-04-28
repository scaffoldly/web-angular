import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { LoginResponse } from '../interfaces/authentication';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  private loginResponse: LoginResponse;
  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.authenticationService.loginResponse$.subscribe((loginResponse) => {
      this.loginResponse = loginResponse;
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.loginResponse || !this.loginResponse.token || !this.loginResponse.verified) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }

    return true;
  }
}
