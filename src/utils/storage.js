// Safe localStorage / sessionStorage helpers (private mode, quota, SSR safe).
const pick = (kind) => {
  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
};

export function readJSON(key, fallback, kind = 'local') {
  try {
    const raw = pick(kind)?.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value, kind = 'local') {
  try {
    pick(kind)?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key, kind = 'local') {
  try {
    pick(kind)?.removeItem(key);
  } catch {
    /* ignore */
  }
}
