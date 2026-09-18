"use client";

import { useState } from "react";
import type { PlaceCategory } from "@/lib/one-access-content";
import { PlacePriorityDialog } from "./place-priority-dialog";
import styles from "./public-site.module.css";

export function PlacePriorityList({
  categories,
  sectionNumber,
}: {
  categories: PlaceCategory[];
  sectionNumber: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = categories.find((category) => category.id === activeId) ?? null;

  return (
    <>
      <ul className={styles.places} aria-label="Lieux à accessibilité prioritaire">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className={styles.placeButton}
              aria-haspopup="dialog"
              onClick={() => setActiveId(category.id)}
            >
              <span className={styles.placeLabel}>{category.label}</span>
              <span className={styles.placeIndicator} aria-hidden="true">
                +
              </span>
            </button>
          </li>
        ))}
      </ul>
      <PlacePriorityDialog
        category={active}
        sectionNumber={sectionNumber}
        onClose={() => setActiveId(null)}
      />
    </>
  );
}
