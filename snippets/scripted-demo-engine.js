/**
 * Scripted product-demo engine (spring tilt + simulated cursor + cinematic zoom)
 * ────────────────────────────────────────────────────────────────────────────
 * A generalized version of the engine behind JEETrack's landing-page demo —
 * the auto-playing "here's what the dashboard looks like" card, where a
 * simulated cursor moves to real UI elements, clicks them, and the whole
 * card punches into a cinematic zoom centered on that click point.
 *
 * The interesting engineering problems this solves:
 *
 *  1. The card has real 3D hover-tilt (mouse-follow), driven by spring
 *     interpolation rather than direct CSS transitions — direct transitions
 *     look mechanical on fast mouse movement; lerping toward a target each
 *     frame feels physical, and lets a scripted "cursor click" *nudge* the
 *     tilt (kickTilt) without fighting the hover state.
 *
 *  2. The simulated cursor doesn't animate to hardcoded coordinates — it
 *     measures the real bounding box of whatever DOM element is next in the
 *     script, so the demo never drifts out of sync if the layout changes.
 *
 *  3. The "cinematic zoom" needs a transform-origin that follows the click
 *     point, not a fixed center — otherwise a zoom on a top-left element
 *     visually flies away from the cursor instead of zooming into it.
 *
 *  4. Steps are chained through a single `next()` continuation rather than
 *     nested setTimeouts, so the whole script can be paused, restarted, or
 *     extended without re-threading a pyramid of callbacks — and so a demo
 *     that gets re-triggered mid-flight (e.g. the card scrolls back into
 *     view while a previous run is still animating) can be guarded with one
 *     "run token" check instead of scattered flags.
 *
 * Framework-agnostic — everything below operates on plain DOM elements.
 */

const CURSOR_MS = 780;
const CURSOR_SLOW_MS = 1180;
const ZOOM_SCALE = 1.55;
const ZOOM_OUT_MS = 780;
const TILT_REST = { rx: 2, ry: -8 };

function createDemoEngine({ card, cursor, zoomStage }) {
  const REDUCE_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tilt = { cur: { rx: TILT_REST.rx, ry: TILT_REST.ry, tz: 0 }, target: { ...TILT_REST } };
  let runToken = 0; // bumped on every restart; stale timeouts check this and bail

  // ── Spring-interpolated tilt loop ──
  // Runs continuously; hover and scripted clicks both just adjust `target`
  // or nudge `cur` directly (kickTilt) rather than owning the animation.
  function tick() {
    const s = tilt.cur, t = tilt.target;
    s.rx += (t.rx - s.rx) * 0.16;
    s.ry += (t.ry - s.ry) * 0.16;
    s.tz += (0 - s.tz) * 0.16;
    card.style.transform = `perspective(1400px) rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg) translateZ(${s.tz.toFixed(2)}px)`;
    requestAnimationFrame(tick);
  }
  if (!REDUCE_MOTION) requestAnimationFrame(tick);

  function setTiltFromPoint(x, y) {
    if (REDUCE_MOTION) return;
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const nx = (Math.min(1, Math.max(0, x / r.width))) * 2 - 1;
    const ny = (Math.min(1, Math.max(0, y / r.height))) * 2 - 1;
    tilt.target.ry = TILT_REST.ry + nx * 9;
    tilt.target.rx = TILT_REST.rx - ny * 6;
  }

  function kickTilt(dtz) {
    if (!REDUCE_MOTION) tilt.cur.tz += dtz;
  }

  // ── Cinematic zoom, origin-locked to the click point ──
  function zoomInTowards(x, y, durationMs) {
    if (!zoomStage) return;
    const w = card.clientWidth || 1, h = card.clientHeight || 1;
    const ox = Math.min(100, Math.max(0, (x / w) * 100));
    const oy = Math.min(100, Math.max(0, (y / h) * 100));
    zoomStage.style.transformOrigin = `${ox}% ${oy}%`;
    zoomStage.style.transition = `transform ${durationMs}ms cubic-bezier(.45,0,.15,1)`;
    zoomStage.style.transform = `scale(${ZOOM_SCALE})`;
    kickTilt(22);
  }

  function zoomOut() {
    if (!zoomStage) return;
    zoomStage.style.transition = `transform ${ZOOM_OUT_MS}ms cubic-bezier(.16,1,.3,1)`;
    zoomStage.style.transform = 'scale(1)';
    tilt.target = { ...TILT_REST };
    kickTilt(-8);
  }

  // ── Simulated cursor: measures the real element, travels, "clicks" ──
  function moveCursorTo(el, { slow = false, cinematic = false } = {}) {
    return new Promise((resolve) => {
      const myRun = runToken;
      if (!el) return resolve();

      const cardRect = card.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const x = elRect.left - cardRect.left + elRect.width / 2;
      const y = elRect.top - cardRect.top + elRect.height / 2;
      const travelMs = slow ? CURSOR_SLOW_MS : CURSOR_MS;

      setTiltFromPoint(x, y);
      cursor.style.transition = `transform ${travelMs}ms cubic-bezier(.45,0,.15,1)`;
      cursor.style.transform = `translate(${x}px,${y}px)`;
      cursor.classList.add('traveling');
      if (cinematic) zoomInTowards(x, y, travelMs);

      setTimeout(() => {
        if (myRun !== runToken) return; // a newer run started; abandon this callback
        cursor.classList.remove('traveling');
        cursor.classList.add('clicking');
        setTimeout(() => cursor.classList.remove('clicking'), 460);
        resolve();
      }, travelMs);
    });
  }

  // ── Script runner: an ordered list of steps, restart-safe ──
  async function playScript(steps) {
    const myRun = ++runToken; // any in-flight run's callbacks now no-op
    for (const step of steps) {
      if (myRun !== runToken) return; // superseded by a newer playScript() call
      await step({ moveCursorTo, zoomOut });
    }
  }

  return { playScript, moveCursorTo, zoomOut };
}

export { createDemoEngine };

/* Example usage:

const engine = createDemoEngine({
  card: document.querySelector('.demo-card'),
  cursor: document.querySelector('.demo-cursor'),
  zoomStage: document.querySelector('.demo-zoom-stage'),
});

engine.playScript([
  ({ moveCursorTo }) => moveCursorTo(document.querySelector('[data-view="tests"]'), { slow: true, cinematic: true }),
  ({ zoomOut }) => { zoomOut(); return new Promise((r) => setTimeout(r, 600)); },
  ({ moveCursorTo }) => moveCursorTo(document.querySelector('[data-view="insights"]')),
]);

*/
