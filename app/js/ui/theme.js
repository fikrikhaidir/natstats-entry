// Light/dark theme: follows the system until the visitor picks one, then remembers it.
const KEY = 'nusa-theme';

function saved() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function currentTheme() {
  return document.documentElement.dataset.theme;
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function initTheme() {
  applyTheme(saved() ?? 'dark');
}

export function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Private mode: the choice just lasts until the page closes.
  }
  return next;
}
