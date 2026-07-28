export const PRODUCTION_ORIGIN = 'https://kalebcole.com';

const hostnamePattern = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

export function resolveSocialImageOrigin({ VERCEL_ENV, VERCEL_URL } = {}) {
  if (VERCEL_ENV !== 'preview') return PRODUCTION_ORIGIN;

  const hostname = VERCEL_URL?.trim();
  if (!hostname || !hostnamePattern.test(hostname)) {
    throw new Error('Vercel preview builds require VERCEL_URL to be a bare deployment hostname.');
  }

  return `https://${hostname}`;
}
