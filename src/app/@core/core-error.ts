export default class CoreError extends Error {
  public readonly reason: any | undefined;
  constructor(message: string, reason?: any) {
    super(message);
    this.name = 'CoreError';
    this.reason = reason;

    if (reason && reason.name === 'HttpErrorResponse') {
      this.name = undefined;
      this.message = (reason.error && reason.error.message) || `HTTP ${reason.status}: ${message}`;
    }
  }
}
