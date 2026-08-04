/**
 * Single source of truth for the portrait.
 *
 * The master photograph lives at `assets/portrait.jpg`. Every published variant —
 * the homepage polaroid candidates and the link-preview card — is generated from it
 * by `npm run portrait`, so replacing the master updates every surface at once.
 */
export const PORTRAIT_MASTER = 'assets/portrait.jpg';

/** Describes the subject of the photograph, without naming its surrounding layout. */
export const PORTRAIT_SUBJECT = 'Kaleb Cole smiling in a navy suit jacket and maroon shirt';

/** Alternative text for the homepage polaroid, where the photo stands on its own. */
export const PORTRAIT_ALT = PORTRAIT_SUBJECT;
