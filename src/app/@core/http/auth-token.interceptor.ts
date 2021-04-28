import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { loginResponseKey } from '@app/@shared/service/authentication.service';
import { LoginResponse } from '@app/@shared/interfaces/authentication';

/**
 * Injects the Authorization header to HTTP requests if it's set
 */
@Injectable({
  providedIn: 'root',
})
export class AuthTokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const savedLoginResponse = sessionStorage.getItem(loginResponseKey) || localStorage.getItem(loginResponseKey);
    if (!savedLoginResponse) {
      return next.handle(request);
    }

    const loginResponse: LoginResponse = JSON.parse(savedLoginResponse);

    const { token } = loginResponse;
    if (!token) {
      return next.handle(request);
    }

    const clone = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${loginResponse.token}`),
    });

    return next.handle(clone);
  }
}
