export interface Account {
  id: string;
  sk: string;
  name: string;
  email: string;
  company?: string;
  updates?: boolean;
}
