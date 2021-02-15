import { Injectable } from '@angular/core';
import { Credential } from '@app/@shared/interfaces/credential';

export const credentialKey = 'credential';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private _credential: Credential | null = null;

  constructor() {
    const savedCredential = sessionStorage.getItem(credentialKey) || localStorage.getItem(credentialKey);
    if (savedCredential) {
      this._credential = JSON.parse(savedCredential);
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this._credential;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credential(): Credential | null {
    return this._credential;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credential The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredential(credential?: Credential, remember?: boolean) {
    this._credential = credential || null;

    if (credential) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialKey, JSON.stringify(credential));
    } else {
      sessionStorage.removeItem(credentialKey);
      localStorage.removeItem(credentialKey);
    }

    return this._credential;
  }
}
