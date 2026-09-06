import assert from 'node:assert/strict';
import test from 'node:test';
import {
  initPublicationMotion,
  buildPublicationKeyframes,
} from '../src/scripts/publication-motion.mjs';

function motionElement(top) {
  const calls = [];
  return {
    calls,
    style: {},
    getBoundingClientRect() {
      return { top };
    },
    animate(keyframes, options) {
      calls.push({ keyframes, options });
      return { cancel() {} };
    },
  };
}

function motionEnvironment(elements, { narrow = false, reduced = false } = {}) {
  const observers = [];
  const browserWindow = {
    innerHeight: 600,
    matchMedia(query) {
      return { matches: query.includes('max-width') ? narrow : reduced };
    },
    IntersectionObserver: class {
      constructor(callback) {
        this.callback = callback;
        this.observed = [];
        this.unobserved = [];
        this.disconnected = false;
        observers.push(this);
      }

      observe(element) {
        this.observed.push(element);
      }

      unobserve(element) {
        this.unobserved.push(element);
      }

      disconnect() {
        this.disconnected = true;
      }
    },
  };
  return {
    browserWindow,
    observers,
    root: { querySelectorAll: () => elements },
  };
}

test('observes only motion beats below the initial viewport', () => {
  const visible = motionElement(120);
  const belowFold = motionElement(700);
  const { browserWindow, observers, root } = motionEnvironment([visible, belowFold]);

  initPublicationMotion(root, browserWindow);

  assert.deepEqual(observers[0].observed, [belowFold]);
  assert.deepEqual(visible.calls, []);
});

test('animates an intersecting target once and immediately unobserves it', () => {
  const target = motionElement(700);
  const { browserWindow, observers, root } = motionEnvironment([target]);

  initPublicationMotion(root, browserWindow);
  observers[0].callback([{ target, isIntersecting: true }]);
  observers[0].callback([{ target, isIntersecting: true }]);

  assert.equal(target.calls.length, 1);
  assert.deepEqual(observers[0].unobserved, [target]);
});

test('builds alternating desktop and vertical narrow-screen entrance keyframes', () => {
  assert.deepEqual(buildPublicationKeyframes(0, false), [
    { opacity: 0, filter: 'blur(2px)', translate: '-34px 0' },
    { opacity: 1, filter: 'blur(0)', translate: '0 0' },
  ]);
  assert.deepEqual(buildPublicationKeyframes(1, false), [
    { opacity: 0, filter: 'blur(2px)', translate: '34px 0' },
    { opacity: 1, filter: 'blur(0)', translate: '0 0' },
  ]);
  assert.deepEqual(buildPublicationKeyframes(0, true), [
    { opacity: 0, filter: 'blur(2px)', translate: '0 34px' },
    { opacity: 1, filter: 'blur(0)', translate: '0 0' },
  ]);
});

test('uses the approved timing and a bounded source-order stagger', () => {
  const first = motionElement(700);
  const later = motionElement(800);
  const { browserWindow, observers, root } = motionEnvironment([first, later]);

  initPublicationMotion(root, browserWindow);
  observers[0].callback([
    { target: first, isIntersecting: true },
    { target: later, isIntersecting: true },
  ]);

  assert.deepEqual(first.calls[0].options, {
    duration: 430,
    easing: 'cubic-bezier(.2, .8, .2, 1)',
    delay: 0,
    fill: 'both',
  });
  assert.equal(later.calls[0].options.delay, 55);
});

test('keeps source-order delay when an earlier beat is initially visible', () => {
  const visible = motionElement(120);
  const target = motionElement(700);
  const { browserWindow, observers, root } = motionEnvironment([visible, target]);

  initPublicationMotion(root, browserWindow);
  observers[0].callback([{ target, isIntersecting: true }]);

  assert.equal(target.calls[0].options.delay, 55);
});

test('does nothing when reduced motion is preferred', () => {
  const target = motionElement(700);
  const { browserWindow, observers, root } = motionEnvironment([target], { reduced: true });

  const cleanup = initPublicationMotion(root, browserWindow);

  assert.equal(typeof cleanup, 'function');
  assert.deepEqual(observers, []);
  assert.deepEqual(target.calls, []);
});

test('leaves content untouched when required browser APIs are unavailable', () => {
  const noObserverTarget = motionElement(700);
  const noObserver = motionEnvironment([noObserverTarget]);
  delete noObserver.browserWindow.IntersectionObserver;
  initPublicationMotion(noObserver.root, noObserver.browserWindow);

  const noAnimateTarget = motionElement(700);
  delete noAnimateTarget.animate;
  const noAnimate = motionEnvironment([noAnimateTarget]);
  initPublicationMotion(noAnimate.root, noAnimate.browserWindow);

  assert.deepEqual(noObserver.observers, []);
  assert.deepEqual(noObserverTarget.style, {});
  assert.deepEqual(noAnimate.observers[0].observed, []);
  assert.deepEqual(noAnimateTarget.style, {});
});

test('never assigns a persistent hidden state before an entrance starts', () => {
  const target = motionElement(700);
  const { browserWindow, root } = motionEnvironment([target]);

  initPublicationMotion(root, browserWindow);

  assert.equal(target.style.opacity, undefined);
  assert.equal(target.className, undefined);
  assert.deepEqual(target.calls, []);
});
