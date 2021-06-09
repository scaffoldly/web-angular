import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tokenResponseKey } from '@app/@shared/service/authentication.service';
import { TokenResponse } from '@app/@openapi/auth';

/**
 * Injects the Authorization header to HTTP requests if it's set
 */
@Injectable({
  providedIn: 'root',
})
export class AuthTokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const savedTokenResponse = sessionStorage.getItem(tokenResponseKey) || localStorage.getItem(tokenResponseKey);
    if (!savedTokenResponse) {
      return next.handle(request);
    }

    const tokenResponse: TokenResponse = JSON.parse(savedTokenResponse);

    const { token } = tokenResponse;
    if (!token) {
      return next.handle(request);
    }

    const clone = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${tokenResponse.token}`),
    });

    return next.handle(clone);
  }
}
