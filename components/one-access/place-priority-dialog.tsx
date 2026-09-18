"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogClose, DialogTitle } from "@/components/ui/dialog";
import type { PlaceCategory } from "@/lib/one-access-content";
import styles from "./place-priority-dialog.module.css";

type PlacePriorityDialogProps = {
  category: PlaceCategory | null;
  sectionNumber: string;
  onClose: () => void;
};

export function PlacePriorityDialog({
  category,
  sectionNumber,
  onClose,
}: PlacePriorityDialogProps) {
  // Keep the last category while the exit transition runs.
  const lastCategory = useLastDefined(category);

  return (
    <Dialog
      overlayClassName={styles.overlay}
      className={styles.modal}
      showCloseButton={false}
      isOpen={category !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {lastCategory && (
        <>
          <header className={styles.header}>
            <DialogTitle className={styles.title}>
              <span>{sectionNumber}</span> / {lastCategory.label}
            </DialogTitle>
            <DialogClose
              variant="ghost"
              size="icon"
              className={styles.close}
              aria-label="Fermer"
            >
              <X aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
            </DialogClose>
          </header>
          <div className={styles.body}>
            <section aria-labelledby="place-priority-why">
              <h3 id="place-priority-why" className={styles.label}>
                Pourquoi prioritaire ?
              </h3>
              <p className={styles.rationale}>{lastCategory.rationale}</p>
            </section>
            <section aria-labelledby="place-priority-observations">
              <h3 id="place-priority-observations" className={styles.label}>
                Ce que ONE:ACCESS pourrait observer
              </h3>
              <ul className={styles.observations}>
                {lastCategory.observations.map((observation) => (
                  <li key={observation}>
                    <span aria-hidden="true">→</span>
                    {observation}
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="place-priority-examples">
              <h3 id="place-priority-examples" className={styles.label}>
                Exemples
              </h3>
              <p className={styles.examples}>
                {lastCategory.examples.join(" · ")}
              </p>
            </section>
          </div>
        </>
      )}
    </Dialog>
  );
}

function useLastDefined<T>(value: T | null): T | null {
  const [last, setLast] = useState<T | null>(value);
  if (value !== null && value !== last) setLast(value);
  return value ?? last;
}
