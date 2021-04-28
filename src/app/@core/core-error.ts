import { HttpErrorResponse } from '@angular/common/http';

export default class CoreError extends Error {
  public readonly reason: any | undefined;
  public readonly code: number | undefined;
  constructor(message: string, reason?: any) {
    super(message);
    this.name = 'Core Error';
    this.reason = reason;

    if ((reason && reason.name === 'HttpErrorResponse') || reason instanceof HttpErrorResponse) {
      this.name = 'Backend Error';
      this.message = (reason.error && reason.error.message) || `HTTP ${reason.status}: ${message}`;
      this.code = (reason.error && reason.error.coode) || reason.status;
    }
  }
}
