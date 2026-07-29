/**
 * Debounced, diff-only sync
 * ─────────────────────────
 * A generalized version of the pattern used in JEETrack to keep local state
 * and a remote database in sync without hammering the network on every
 * keystroke, checkbox toggle, or timer tick.
 *
 * The problem: naive "save on every change" works fine in a demo and then
 * multiplies badly once real usage kicks in — every small edit becomes its
 * own round-trip, and most of those writes are re-sending data that hasn't
 * actually changed.
 *
 * This version:
 *   1. Batches rapid edits behind a short debounce window
 *   2. Diffs the current state against the last-synced snapshot and only
 *      sends entities that actually changed
 *   3. Flushes immediately on tab-hide/unload so nothing is lost on close
 *
 * Framework-agnostic — swap `upsertEntity` for whatever your backend client
 * looks like (Supabase, a REST call, etc.).
 */

const DEBOUNCE_MS = 1200;

let debounceTimer = null;
let lastSyncedSnapshot = {}; // { [entityKey]: JSON string of last-synced value }

/**
 * Call this whenever local state changes. Cheap — just schedules a sync,
 * doesn't do any network work itself.
 */
function scheduleSync(state) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => syncNow(state), DEBOUNCE_MS);
}

/**
 * Diffs `state` against the last-synced snapshot and upserts only the
 * entities whose serialized value actually changed.
 */
async function syncNow(state) {
  const changed = [];

  for (const [key, value] of Object.entries(state)) {
    const serialized = JSON.stringify(value);
    if (lastSyncedSnapshot[key] !== serialized) {
      changed.push({ key, value });
    }
  }

  if (changed.length === 0) return;

  try {
    await Promise.all(changed.map(({ key, value }) => upsertEntity(key, value)));
    // Only commit to the snapshot after a successful write, so a failed
    // sync gets retried on the next change instead of silently "succeeding".
    for (const { key, value } of changed) {
      lastSyncedSnapshot[key] = JSON.stringify(value);
    }
  } catch (err) {
    console.error('Sync failed, will retry on next change:', err);
  }
}

/** Replace with your actual backend call. */
async function upsertEntity(key, value) {
  // e.g. return supabase.from(tableForKey(key)).upsert(value);
  throw new Error('upsertEntity() is a stub — wire this up to your backend');
}

// Make sure in-flight edits aren't lost if the user closes the tab or
// switches away before the debounce timer fires.
function flushSyncOnHide(state) {
  const flush = () => {
    clearTimeout(debounceTimer);
    syncNow(state);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  window.addEventListener('beforeunload', flush);
}

export { scheduleSync, syncNow, flushSyncOnHide };
