import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * Single source of truth for the portrait.
 *
 * The master photograph lives at `assets/portrait.jpg`. Every published variant —
 * the homepage polaroid candidates and the link-preview card — is generated from it
 * by `npm run portrait`, so replacing the master updates every surface at once.
 */
export const PORTRAIT_MASTER = 'assets/portrait.jpg';
export const PORTRAIT_VERSION = createHash('sha256')
  .update(readFileSync(new URL(`../../${PORTRAIT_MASTER}`, import.meta.url)))
  .digest('hex')
  .slice(0, 12);
export const PORTRAIT_SOCIAL_IMAGE = `/social/homepage-${PORTRAIT_VERSION}.png`;

/** Durable alternative text shared by every generated portrait surface. */
export const PORTRAIT_SUBJECT = 'Portrait of Kaleb Cole';

/** Alternative text for the homepage polaroid, where the photo stands on its own. */
export const PORTRAIT_ALT = PORTRAIT_SUBJECT;
