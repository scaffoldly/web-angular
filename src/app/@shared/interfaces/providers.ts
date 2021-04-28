export type Providers = { [provider: string]: Provider };

export interface Provider {
  name: string;
  clientId: string;
}
