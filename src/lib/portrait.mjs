import { PORTRAIT_SOCIAL_IMAGE } from './portrait-social-image.generated.mjs';
import { PORTRAIT_MASTER } from './portrait-source.mjs';

/**
 * Single source of truth for the portrait.
 *
 * The master photograph lives at `assets/portrait.jpg`. Every published variant —
 * the homepage polaroid candidates and the link-preview card — is generated from it
 * by `npm run portrait`, so replacing the master updates every surface at once.
 */
export { PORTRAIT_MASTER, PORTRAIT_SOCIAL_IMAGE };

/** Durable alternative text shared by every generated portrait surface. */
export const PORTRAIT_SUBJECT = 'Portrait of Kaleb Cole';

/** Alternative text for the homepage polaroid, where the photo stands on its own. */
export const PORTRAIT_ALT = PORTRAIT_SUBJECT;
