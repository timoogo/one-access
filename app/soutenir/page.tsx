import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import {
  PublicFooter,
  PublicHeader,
  TechnicalSectionLabel,
} from "@/components/one-access/primitives";
import styles from "@/components/one-access/public-site.module.css";

export const metadata: Metadata = {
  title: "Soutenir le projet — ONE:ACCESS",
  description:
    "Le dispositif de soutien au projet ONE:ACCESS est en préparation.",
};

export default function SupportPage() {
  return (
    <div className={styles.site}>
      <PublicHeader />
      <main id="contenu" tabIndex={-1} className={styles.supportPage}>
        <TechnicalSectionLabel number="→">
          Soutenir ONE:ACCESS
        </TechnicalSectionLabel>
        <p className="oa-label">Dispositif de soutien en préparation</p>
        <h1>
          Même destination.
          <br />
          <span>
            Une ambition
            <br />
            commune.
          </span>
        </h1>
        <p>
          ONE:ACCESS propose de rendre mesurables les écarts d’accessibilité
          vécus au quotidien, pour mieux agir sur les parcours et l’autonomie.
        </p>
        <p>
          Le mécanisme de soutien et de signature est en préparation. Aucune
          signature ni donnée personnelle n’est recueillie sur cette page pour
          le moment.
        </p>
        <LinkButton href="/" variant="outline" className={styles.cta}>
          <ArrowLeft aria-hidden="true" />
          Revenir au projet
        </LinkButton>
      </main>
      <PublicFooter />
    </div>
  );
}
