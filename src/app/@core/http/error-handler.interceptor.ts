import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../logger.service';
import CoreError from '../core-error';
import { AuthenticationService } from '@app/@shared/service/authentication.service';
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
    if (!environment.production) {
      // Do something with the error
      log.error('Request error', response);
    }

    if (!(response instanceof HttpErrorResponse)) {
      return this.toastThrowError(new CoreError('Request error', response));
    }

    const errorResponse = response as HttpErrorResponse;
    const { status } = errorResponse;

    if (status !== 401) {
      return this.toastThrowError(new CoreError('Request error', response));
    }

    return this.authenticationService.refresh().pipe(
      mergeMap((credential) => {
        return this.intercept(
          request.clone({
            headers: request.headers.set('Authorization', `Bearer ${credential.token}`),
          }),
          next
        );
      }),
      catchError((error) => {
        return this.authenticationService.logout().pipe(() => {
          this.router.navigate(['/login'], { replaceUrl: true });
          return this.toastThrowError(new CoreError('Token refresh error', error));
        });
      })
    );
  }

  private toastThrowError(error: CoreError): Observable<never> {
    this.toastrService.error(error.message, error.name);
    return throwError(error);
  }
}
