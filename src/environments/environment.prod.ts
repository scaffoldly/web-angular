import { env } from './env';

export const environment = {
  production: true,
  hmr: false,
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  ...env,
};
