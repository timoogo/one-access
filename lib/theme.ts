export const THEMES = ["carbon", "concrete"] as const;
export type Theme = (typeof THEMES)[number];

/** CARBON is the ONE:ACCESS default and the server-rendered state. */
export const DEFAULT_THEME: Theme = "carbon";
export const THEME_STORAGE_KEY = "one-access-theme";

export function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme);
}

/**
 * Runs synchronously in <head>, before first paint, so a remembered theme is
 * applied before any content is rendered. Falls back silently to the
 * server-rendered default when storage is unavailable.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(${JSON.stringify(THEMES)}.indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}})();`;
