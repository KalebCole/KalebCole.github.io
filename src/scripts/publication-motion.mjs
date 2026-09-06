export const PUBLICATION_MOTION_DURATION = 430;
export const PUBLICATION_MOTION_STAGGER = 55;
export const PUBLICATION_MOTION_EASING = 'cubic-bezier(.2, .8, .2, 1)';
export const PUBLICATION_MOTION_MOBILE_BREAKPOINT = 760;
export const PUBLICATION_MOTION_MEDIA = `(max-width: ${PUBLICATION_MOTION_MOBILE_BREAKPOINT}px)`;

export function buildPublicationKeyframes(index, narrowScreen) {
  const translate = narrowScreen
    ? '0 34px'
    : index % 2 === 0 ? '-34px 0' : '34px 0';

  return [
    { opacity: 0, filter: 'blur(2px)', translate },
    { opacity: 1, filter: 'blur(0)', translate: '0 0' },
  ];
}

export function publicationMotionDelay(index) {
  return Math.min(index * PUBLICATION_MOTION_STAGGER, PUBLICATION_MOTION_STAGGER);
}

export function initPublicationMotion(root = document, browserWindow = window) {
  if (
    !root
    || typeof root.querySelectorAll !== 'function'
    || typeof browserWindow?.matchMedia !== 'function'
    || typeof browserWindow?.IntersectionObserver !== 'function'
  ) return () => {};

  const reducedMotion = browserWindow.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return () => {};

  const narrowScreen = browserWindow.matchMedia(PUBLICATION_MOTION_MEDIA);
  const viewportHeight = browserWindow.innerHeight;
  const beats = Array.from(root.querySelectorAll('[data-motion-beat]'));
  const targets = beats.filter((element) => (
    typeof element.animate === 'function'
    && element.getBoundingClientRect().top >= viewportHeight
  ));
  const targetIndexes = new Map(beats.map((target, index) => [target, index]));
  const animatedTargets = new Set();
  const animations = new Set();

  const observer = new browserWindow.IntersectionObserver((entries) => {
    for (const entry of entries) {
      const { target } = entry;
      if (!entry.isIntersecting || !targetIndexes.has(target) || animatedTargets.has(target)) continue;

      animatedTargets.add(target);
      observer.unobserve(target);
      const animation = target.animate(
        buildPublicationKeyframes(targetIndexes.get(target), narrowScreen.matches),
        {
          duration: PUBLICATION_MOTION_DURATION,
          easing: PUBLICATION_MOTION_EASING,
          delay: publicationMotionDelay(targetIndexes.get(target)),
          fill: 'both',
        },
      );
      if (animation && typeof animation.cancel === 'function') animations.add(animation);
    }
  });

  for (const target of targets) observer.observe(target);

  return () => {
    observer.disconnect();
    for (const animation of animations) animation.cancel();
    animations.clear();
  };
}
