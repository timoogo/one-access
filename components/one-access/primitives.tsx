import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { differentialLevels } from "@/lib/one-access-content";
import styles from "./public-site.module.css";

export function TechnicalSectionLabel({
  number,
  children,
  note,
}: {
  number: string;
  children: ReactNode;
  note?: string;
}) {
  return (
    <div className={styles.sectionLabel} data-motion-label>
      <span>{number}</span>
      <p>{children}</p>
      <i aria-hidden="true" />
      {note && <small>{note}</small>}
    </div>
  );
}

export function AccessibilityScore({
  value,
  diamond = false,
}: {
  value: string;
  diamond?: boolean;
}) {
  return (
    <span className={`${styles.score} ${diamond ? styles.diamond : ""}`}>
      <span>
        {value === "∞" ? (
          <>
            <span aria-hidden="true">∞</span>
            <span className="sr-only">Infini</span>
          </>
        ) : (
          value
        )}
      </span>
    </span>
  );
}

export function DifferentialScale() {
  return (
    <div>
      <p className={styles.scaleDirection}>
        Écart croissant <ArrowRight aria-hidden="true" size={18} />
      </p>
      <ol className={styles.scale} data-motion-scale>
        <i className={styles.scaleAxis} data-motion-scale-axis aria-hidden="true" />
        {differentialLevels.map((level, index) => (
          <li key={level.value} data-motion-scale-marker>
            <AccessibilityScore value={level.value} diamond={index % 2 === 1} />
            <div>
              <h3>{level.label}</h3>
              <p>{level.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Decorative architectural study. Replace its interior with a local photo when available;
// retain the frame and caption. It depicts no actual building or measured location.
export function ArchitecturalFrame({ compact = false }: { compact?: boolean }) {
  return (
    <figure
      className={`${styles.architecture} ${compact ? styles.compactFrame : ""}`}
    >
      <div aria-hidden="true" className={styles.architectureDrawing}>
        <span />
        <span />
        <span />
        <span />
      </div>
      <figcaption>Étude de circulation · visuel provisoire</figcaption>
    </figure>
  );
}

export function SupportLink({
  children = "Soutenir le projet",
}: {
  children?: ReactNode;
}) {
  return (
    <LinkButton href="/soutenir" className={styles.cta}>
      {children}
      <ArrowRight aria-hidden="true" data-icon="inline-end" />
    </LinkButton>
  );
}

export function PublicHeader() {
  return (
    <>
      <a href="#contenu" className={styles.skipLink}>
        Aller au contenu
      </a>
      <header className={styles.header}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="ONE:ACCESS — Accueil"
        >
          <span className={styles.brandMark} data-one-access-logo-target>
            ONE<span>:</span>ACCESS
          </span>
        </Link>
        <nav aria-label="Navigation principale">
          <Link href="/#concept">Concept</Link>
          <Link href="/#methodologie">Méthodologie</Link>
          <Link href="/#applications">Cas d’usage</Link>
        </nav>
        <SupportLink>Soutenir</SupportLink>
      </header>
    </>
  );
}

export function PublicFooter() {
  return (
    <footer className={styles.footer} data-motion-footer>
      <Link href="/" className={styles.brand}>
        ONE<span>:</span>ACCESS
      </Link>
      <p>Projet de référentiel · Mobilité, usages, autonomie</p>
      <Link href="/soutenir">
        Soutenir le projet <span aria-hidden="true">↗</span>
      </Link>
    </footer>
  );
}
