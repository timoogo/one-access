import type { Metadata } from "next";
import {
  ApplicationsSection,
  BenefitsSection,
  ConceptSection,
  ExampleSection,
  Hero,
  MethodologySection,
  SupportSection,
} from "@/components/one-access/home-sections";
import { PublicFooter, PublicHeader } from "@/components/one-access/primitives";
import { IntroLoader } from "@/components/one-access/intro-loader";
import styles from "@/components/one-access/public-site.module.css";

export const metadata: Metadata = {
  title: "ONE:ACCESS — Même destination. Des parcours différents.",
  description:
    "Un projet de référentiel pour mesurer les écarts de temps, de distance, d’effort et d’autonomie entre les parcours réels d’un même A → B.",
};

export default function Home() {
  return (
    <div className={styles.site}>
      <IntroLoader />
      <PublicHeader />
      <div className={styles.bodyGrid}>
        <aside className={styles.rail} aria-hidden="true">
          <span>Projet / 2026</span>
          <strong>Référentiel d’accessibilité</strong>
          <i />
          <small>
            Mobilité
            <br />
            Usages
            <br />
            Autonomie
          </small>
        </aside>
        <main id="contenu" tabIndex={-1}>
          <Hero />
          <ConceptSection />
          <MethodologySection />
          <BenefitsSection />
          <ExampleSection />
          <ApplicationsSection />
        </main>
      </div>
      <SupportSection />
      <PublicFooter />
    </div>
  );
}
