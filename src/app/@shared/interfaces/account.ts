export interface AccountDetail {
  email: string;
  name: string;
  company?: string;
}

export interface Account {
  id: string;
  sk: string;
  detail: AccountDetail;
}

export type Providers = { [provider: string]: Provider };

export interface Provider {
  clientId: string;
}
