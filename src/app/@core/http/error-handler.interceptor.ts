import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../logger.service';
import CoreError from '../core-error';
import { AuthenticationService, refreshHeader } from '@app/@shared/service/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error) => this.errorHandler(request, next, error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(
    request: HttpRequest<any>,
    next: HttpHandler,
    response: HttpEvent<any>
  ): Observable<HttpEvent<any>> {
    if (!(response instanceof HttpErrorResponse)) {
      return this.toastThrowError(response, new CoreError('Request error', response));
    }

    const errorResponse = response as HttpErrorResponse;
    const { status } = errorResponse;

    if (
      status === 403 &&
      request.url ===
        (this.authenticationService.token &&
          this.authenticationService.payload &&
          this.authenticationService.payload.refreshUrl)
    ) {
      return this.authenticationService.logout().pipe(() => {
        this.router.navigate(['/login'], { replaceUrl: true });
        return this.toastThrowError(response, new CoreError('Token refresh error', response));
      });
    } else if (status === 401) {
      return this.authenticationService.refresh().pipe(
        mergeMap((loginResponse) => {
          return this.intercept(
            request.clone({
              headers: request.headers.set('Authorization', `Bearer ${loginResponse.token}`),
            }),
            next
          );
        })
      );
    }

    return this.toastThrowError(response, new CoreError('Request error', response));
  }

  private toastThrowError(response: HttpEvent<any>, error: CoreError): Observable<HttpEvent<any>> {
    if (error.code !== 404) {
      this.toastrService.error(error.message, error.name);
    }
    return throwError(error);
  }
}
