import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { credentialKey } from '@app/@shared/service/credentials.service';

/**
 * Injects the Authorization header to HTTP requests if it's set
 */
@Injectable({
  providedIn: 'root',
})
export class AuthTokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const savedCredential = sessionStorage.getItem(credentialKey) || localStorage.getItem(credentialKey);
    if (!savedCredential) {
      return next.handle(request);
    }

    const credential = JSON.parse(savedCredential);

    const { token } = credential;
    if (!token) {
      return next.handle(request);
    }

    const clone = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${credential.token}`),
    });

    return next.handle(clone);
  }
}
