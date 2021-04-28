import { SocialUser } from 'angularx-social-login';

export class EmailLoginRequest {
  provider: string = 'EMAIL';
  email: string;
  code?: string;

  constructor(email: string, code?: string) {
    this.email = email;
    this.code = code;
  }
}

export type SocialLoginRequest = SocialUser;

export interface LoginPayload {
  id: string;
  sk: string;
  name?: string;
  email: string;
  photoUrl?: string;
  refreshUrl: string;
  // TODO: Other stuff?
}

export type VerificationMethod = 'EMAIL' | 'AUTHENTICATOR' | 'NONE';

export interface LoginResponse {
  id: string;
  payload: LoginPayload;
  token?: string;
  verified: boolean;
  verificationMethod: VerificationMethod;
}
