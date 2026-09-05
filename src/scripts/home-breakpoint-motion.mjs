export const HOME_DESKTOP_MEDIA = '(min-width: 850px)';
export const HOME_LAYOUT_MOTION_DURATION = 520;
export const HOME_LAYOUT_MOTION_EASING = 'cubic-bezier(.16, 1, .3, 1)';

function captureRects(elements) {
  return new Map(elements.map((element) => [element, element.getBoundingClientRect()]));
}

export function animateHomeLayoutShift(
  elements,
  previousRects,
  { reducedMotion = false, startOpacity = 0.72 } = {},
) {
  if (reducedMotion) return [];

  return elements.flatMap((element) => {
    const previous = previousRects.get(element);
    if (!previous || typeof element.animate !== 'function') return [];

    const current = element.getBoundingClientRect();
    const x = previous.left - current.left;
    const y = previous.top - current.top;
    if (Math.abs(x) < 0.5 && Math.abs(y) < 0.5) return [];

    return element.animate(
      [
        { translate: `${x}px ${y}px`, opacity: startOpacity },
        { translate: '0 0', opacity: 1 },
      ],
      {
        duration: HOME_LAYOUT_MOTION_DURATION,
        easing: HOME_LAYOUT_MOTION_EASING,
      },
    );
  });
}

export function initHomeBreakpointMotion(root = document, browserWindow = window) {
  const hero = root.querySelector('.home-hero');
  if (!hero || typeof browserWindow.matchMedia !== 'function') return;

  const elements = Array.from(hero.children);
  const desktopMedia = browserWindow.matchMedia(HOME_DESKTOP_MEDIA);
  const reducedMotion = browserWindow.matchMedia('(prefers-reduced-motion: reduce)');
  let previousRects;
  let wasDesktop;
  let activeAnimations = [];
  let motionVersion = 0;
  let resizeFrame;

  const updateRects = () => {
    previousRects = captureRects(elements);
    wasDesktop = desktopMedia.matches;
  };

  const measureResize = () => {
    resizeFrame = undefined;
    const isDesktop = desktopMedia.matches;
    const currentRects = captureRects(elements);

    if (isDesktop !== wasDesktop) {
      const version = ++motionVersion;
      for (const animation of activeAnimations) animation.cancel();
      activeAnimations = animateHomeLayoutShift(elements, previousRects, {
        reducedMotion: reducedMotion.matches,
        startOpacity: Number(hero.dataset?.motionOpacity || 0.72),
      });
      previousRects = currentRects;
      wasDesktop = isDesktop;

      const finished = activeAnimations
        .map((animation) => animation.finished)
        .filter(Boolean)
        .map((promise) => promise.catch(() => undefined));
      Promise.all(finished).then(() => {
        if (version !== motionVersion) return;
        activeAnimations = [];
        if (desktopMedia.matches === wasDesktop) {
          previousRects = captureRects(elements);
        }
      });
    } else if (activeAnimations.length === 0) {
      previousRects = currentRects;
    }
  };

  const onResize = () => {
    if (resizeFrame && typeof browserWindow.cancelAnimationFrame === 'function') {
      browserWindow.cancelAnimationFrame(resizeFrame);
    }
    resizeFrame = browserWindow.requestAnimationFrame(measureResize);
  };

  const start = () => {
    updateRects();
    if (typeof desktopMedia.addEventListener === 'function') {
      desktopMedia.addEventListener('change', onResize);
      browserWindow.addEventListener('resize', () => {
        if (desktopMedia.matches === wasDesktop && activeAnimations.length === 0) onResize();
      }, { passive: true });
    } else if (typeof desktopMedia.addListener === 'function') {
      desktopMedia.addListener(onResize);
      browserWindow.addEventListener('resize', () => {
        if (desktopMedia.matches === wasDesktop && activeAnimations.length === 0) onResize();
      }, { passive: true });
    } else {
      browserWindow.addEventListener('resize', onResize, { passive: true });
    }
  };

  browserWindow.requestAnimationFrame(() => {
    const entranceAnimations = typeof hero.getAnimations === 'function'
      ? hero.getAnimations({ subtree: true })
      : [];
    Promise.allSettled(entranceAnimations.map((animation) => animation.finished)).then(start);
  });
}
