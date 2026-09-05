export const HOME_SCOPE_OPTIONS = [
  { id: 'all', name: 'Full layout', count: 5, description: 'Greeting, portrait, statement, supporting copy, and actions all settle.' },
  { id: 'portrait', name: 'Portrait only', count: 1, description: 'Your photo provides continuity while every text block snaps.' },
  { id: 'copy', name: 'Copy only', count: 4, description: 'All text and actions settle while the portrait snaps into place.' },
  { id: 'intro', name: 'Intro trio', count: 3, description: 'Greeting, portrait, and main statement settle as one introduction.' },
  { id: 'core', name: 'Core pair', count: 2, description: 'Only the portrait and main statement settle across the breakpoint.' },
];

const LAB_STYLES = `
  .home-motion-lab {
    position: fixed;
    z-index: 80;
    right: 1rem;
    bottom: 1rem;
    width: min(22rem, calc(100vw - 2rem));
    padding: 1rem;
    background: color-mix(in oklch, var(--ground) 94%, transparent);
    border: 1px solid var(--rule);
    border-radius: 8px;
    box-shadow: 0 16px 48px color-mix(in oklch, var(--ink) 24%, transparent);
    color: var(--ink);
    cursor: grab;
    backdrop-filter: blur(12px);
  }
  .home-motion-lab[data-dragging="true"] { cursor: grabbing; }
  .home-motion-lab-header { display: grid; grid-template-columns: 44px 1fr 44px; align-items: center; gap: .65rem; }
  .home-motion-lab button { min-height: 44px; border: 1px solid var(--rule); border-radius: 999px; background: var(--ground); color: var(--ink); cursor: pointer; }
  .home-motion-lab button:hover { border-color: var(--blue); color: var(--blue); }
  .home-motion-lab-title { margin: 0; font-size: 1.05rem; text-align: center; }
  .home-motion-lab-state { color: var(--muted); font-family: var(--font-meta); font-size: .7rem; text-align: center; }
  .home-motion-lab-description { min-height: 2.7em; margin: .75rem 0; color: var(--muted); font-size: .86rem; text-align: center; }
  .home-motion-lab-dots { display: flex; justify-content: center; gap: .4rem; }
  .home-motion-lab-dots button { width: 24px; min-height: 24px; padding: 0; border: 0; background: radial-gradient(circle, var(--rule) 0 5px, transparent 6px); }
  .home-motion-lab-dots button[aria-current="true"] { width: 32px; background: radial-gradient(circle, var(--blue) 0 5px, transparent 6px); }
  @media (max-width: 430px) { .home-motion-lab { right: .5rem; bottom: .5rem; width: calc(100vw - 1rem); } }
`;

export function initHomeScopeLab(root = document, browserWindow = window) {
  const params = new URLSearchParams(browserWindow.location.search);
  if (params.get('motionLab') !== 'scope') return;

  const hero = root.querySelector('.home-hero');
  if (!hero) return;

  const style = root.createElement('style');
  style.textContent = LAB_STYLES;
  root.head.append(style);

  const lab = root.createElement('aside');
  lab.className = 'home-motion-lab';
  lab.setAttribute('aria-label', 'Homepage movement scope lab');
  lab.innerHTML = `
    <div class="home-motion-lab-state">Movement scope · opacity fixed at 100%</div>
    <div class="home-motion-lab-header">
      <button type="button" data-previous aria-label="Previous movement scope">←</button>
      <h2 class="home-motion-lab-title" aria-live="polite"></h2>
      <button type="button" data-next aria-label="Next movement scope">→</button>
    </div>
    <p class="home-motion-lab-description"></p>
    <div class="home-motion-lab-state" data-viewport-state></div>
    <div class="home-motion-lab-dots"></div>
  `;
  root.body.append(lab);

  const requested = params.get('scope');
  let index = Math.max(0, HOME_SCOPE_OPTIONS.findIndex((option) => option.id === requested));
  const title = lab.querySelector('.home-motion-lab-title');
  const description = lab.querySelector('.home-motion-lab-description');
  const viewportState = lab.querySelector('[data-viewport-state]');
  const dots = lab.querySelector('.home-motion-lab-dots');

  HOME_SCOPE_OPTIONS.forEach((option, optionIndex) => {
    const dot = root.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', option.name);
    dot.addEventListener('click', () => show(optionIndex));
    dots.append(dot);
  });

  function show(nextIndex) {
    index = (nextIndex + HOME_SCOPE_OPTIONS.length) % HOME_SCOPE_OPTIONS.length;
    const option = HOME_SCOPE_OPTIONS[index];
    hero.dataset.motionScope = option.id;
    title.textContent = `${index + 1}/5 · ${option.name} · ${option.count} moving`;
    description.textContent = option.description;
    Array.from(dots.children).forEach((dot, dotIndex) => {
      dot.setAttribute('aria-current', String(dotIndex === index));
    });
    params.set('scope', option.id);
    browserWindow.history.replaceState(null, '', `${browserWindow.location.pathname}?${params}`);
  }

  function updateViewportState() {
    viewportState.textContent = `${browserWindow.innerWidth}px · ${browserWindow.innerWidth >= 850 ? 'desktop split' : 'narrow centered'} · resize across 850px to replay`;
  }

  lab.querySelector('[data-previous]').addEventListener('click', () => show(index - 1));
  lab.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
  browserWindow.addEventListener('resize', updateViewportState, { passive: true });

  let drag;
  lab.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    const box = lab.getBoundingClientRect();
    drag = { x: event.clientX - box.left, y: event.clientY - box.top };
    lab.dataset.dragging = 'true';
    lab.setPointerCapture(event.pointerId);
  });
  lab.addEventListener('pointermove', (event) => {
    if (!drag) return;
    lab.style.left = `${Math.max(8, Math.min(browserWindow.innerWidth - lab.offsetWidth - 8, event.clientX - drag.x))}px`;
    lab.style.top = `${Math.max(8, Math.min(browserWindow.innerHeight - lab.offsetHeight - 8, event.clientY - drag.y))}px`;
    lab.style.right = 'auto';
    lab.style.bottom = 'auto';
  });
  const endDrag = () => {
    drag = undefined;
    lab.dataset.dragging = 'false';
  };
  lab.addEventListener('pointerup', endDrag);
  lab.addEventListener('pointercancel', endDrag);
  lab.addEventListener('lostpointercapture', endDrag);

  show(index);
  updateViewportState();
}
