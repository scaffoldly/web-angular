export interface Payload {
  id: string;
  sk: string;
  email: string;
  name: string;
  photoUrl: string;
  baseUrl: string;
  refreshUrl: string;
}

export interface Credential {
  token: string;
  payload: Payload;
}
