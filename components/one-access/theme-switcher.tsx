"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  isTheme,
  type Theme,
} from "@/lib/theme";
import styles from "./theme-switcher.module.css";

const OPTIONS: { theme: Theme; label: string }[] = [
  { theme: "carbon", label: "Carbon" },
  { theme: "concrete", label: "Concrete" },
];

// The <html data-theme> attribute is the single source of truth: it is set
// before paint by themeInitScript, so components read it instead of owning it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  const theme = document.documentElement.dataset.theme;
  return isTheme(theme) ? theme : DEFAULT_THEME;
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function chooseTheme(theme: Theme) {
  applyTheme(theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (private mode…): the choice still applies to this visit.
  }
}

export function ThemeSwitcher() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_THEME);

  // Keep several open tabs consistent.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY && isTheme(event.newValue)) {
        applyTheme(event.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className={styles.switcher} role="group" aria-label="Thème d’affichage">
      {OPTIONS.map(({ theme: option, label }) => (
        <button
          key={option}
          type="button"
          className={styles.option}
          data-theme-option={option}
          aria-pressed={theme === option}
          onClick={() => chooseTheme(option)}
        >
          <span className={styles.marker} aria-hidden="true" />
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </div>
  );
}
