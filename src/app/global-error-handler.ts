import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}
  handleError(error: any) {
    if (error instanceof Error) {
      const toastrService: ToastrService = this.injector.get(ToastrService);
      toastrService.error(error.message, error.name);
    }

    throw error;
  }
}
