import assert from 'node:assert/strict';
import test from 'node:test';
import {
  animateHomeLayoutShift,
  initHomeBreakpointMotion,
} from '../src/scripts/home-breakpoint-motion.mjs';

function elementAt(rect) {
  const calls = [];
  return {
    calls,
    getBoundingClientRect() {
      return rect;
    },
    animate(keyframes, options) {
      calls.push({ keyframes, options });
      return { cancel() {} };
    },
  };
}

test('settles each hero item from its previous position', () => {
  const greeting = elementAt({ left: 80, top: 120 });
  const portrait = elementAt({ left: 1010, top: 280 });
  const previousRects = new Map([
    [greeting, { left: 195, top: 220 }],
    [portrait, { left: 42, top: 280 }],
  ]);

  const animations = animateHomeLayoutShift([greeting, portrait], previousRects);

  assert.equal(animations.length, 2);
  assert.deepEqual(greeting.calls[0].keyframes, [
    { translate: '115px 100px', opacity: 1 },
    { translate: '0 0', opacity: 1 },
  ]);
  assert.deepEqual(portrait.calls[0].keyframes, [
    { translate: '-968px 0px', opacity: 1 },
    { translate: '0 0', opacity: 1 },
  ]);
  assert.deepEqual(greeting.calls[0].options, {
    duration: 520,
    easing: 'cubic-bezier(.16, 1, .3, 1)',
  });
});

test('does not animate when reduced motion is requested', () => {
  const greeting = elementAt({ left: 80, top: 120 });
  const animations = animateHomeLayoutShift(
    [greeting],
    new Map([[greeting, { left: 195, top: 220 }]]),
    { reducedMotion: true },
  );

  assert.deepEqual(animations, []);
  assert.deepEqual(greeting.calls, []);
});

test('skips items whose screen position did not change', () => {
  const greeting = elementAt({ left: 80, top: 120 });
  const animations = animateHomeLayoutShift(
    [greeting],
    new Map([[greeting, { left: 80, top: 120 }]]),
  );

  assert.deepEqual(animations, []);
  assert.deepEqual(greeting.calls, []);
});

test('keeps the newest animation active during rapid breakpoint crossings', async () => {
  let left = 40;
  const animations = [];
  const element = {
    getBoundingClientRect() {
      return { left, top: 100 };
    },
    animate() {
      let finish;
      const animation = {
        cancelled: false,
        finished: new Promise((resolve) => { finish = resolve; }),
        cancel() {
          this.cancelled = true;
          finish();
        },
      };
      animations.push(animation);
      return animation;
    },
  };
  const hero = {
    children: [element],
    getAnimations() {
      return [];
    },
  };
  const desktopMedia = { matches: false };
  const reducedMotion = { matches: false };
  let onResize;
  const browserWindow = {
    matchMedia(query) {
      return query.includes('850px') ? desktopMedia : reducedMotion;
    },
    requestAnimationFrame(callback) {
      callback();
    },
    addEventListener(event, callback) {
      if (event === 'resize') onResize = callback;
    },
  };

  initHomeBreakpointMotion({ querySelector: () => hero }, browserWindow);
  await Promise.resolve();
  await Promise.resolve();

  left = 500;
  desktopMedia.matches = true;
  onResize();
  left = 40;
  desktopMedia.matches = false;
  onResize();
  await new Promise((resolve) => setImmediate(resolve));

  left = 500;
  desktopMedia.matches = true;
  onResize();

  assert.equal(animations.length, 3);
  assert.equal(animations[1].cancelled, true);
});

test('does not swallow a crossing that happens as an animation finishes', async () => {
  let left = 40;
  const animations = [];
  const element = {
    getBoundingClientRect() {
      return { left, top: 100 };
    },
    animate() {
      let finish;
      const animation = {
        finished: new Promise((resolve) => { finish = resolve; }),
        cancel() {
          finish();
        },
        finish() {
          finish();
        },
      };
      animations.push(animation);
      return animation;
    },
  };
  const hero = {
    children: [element],
    getAnimations() {
      return [];
    },
  };
  const desktopMedia = { matches: false };
  const reducedMotion = { matches: false };
  let onResize;
  const browserWindow = {
    matchMedia(query) {
      return query.includes('850px') ? desktopMedia : reducedMotion;
    },
    requestAnimationFrame(callback) {
      callback();
    },
    addEventListener(event, callback) {
      if (event === 'resize') onResize = callback;
    },
  };

  initHomeBreakpointMotion({ querySelector: () => hero }, browserWindow);
  await Promise.resolve();
  await Promise.resolve();

  left = 500;
  desktopMedia.matches = true;
  onResize();
  left = 40;
  desktopMedia.matches = false;
  animations[0].finish();
  await new Promise((resolve) => setImmediate(resolve));
  onResize();

  assert.equal(animations.length, 2);
});
