import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import {
  PublicFooter,
  PublicHeader,
  TechnicalSectionLabel,
} from "@/components/one-access/primitives";
import styles from "@/components/one-access/public-site.module.css";

export const metadata: Metadata = {
  title: "Soutenir ONE:ACCESS",
  description:
    "Soutenez le principe de ONE:ACCESS, son expérimentation sur des lieux pilotes et la poursuite de l’initiative en signant la pétition sur Change.org.",
};

export default function SupportPage() {
  return (
    <div className={styles.site}>
      <PublicHeader />
      <main id="contenu" tabIndex={-1} className={styles.supportPage}>
        <TechnicalSectionLabel number="→">
          Un principe à expérimenter
        </TechnicalSectionLabel>
        <h1>
          Soutenir
          <br />
          <span>ONE:ACCESS</span>
        </h1>
        <p>
          ONE:ACCESS est un projet expérimental de futur standard pour mesurer
          l’accessibilité réelle, en comparant les parcours d’une même origine
          à une même destination.
        </p>
        <section
          className={styles.supportCommitment}
          aria-labelledby="commitment-title"
        >
          <h2 id="commitment-title">En signant, vous soutenez</h2>
          <ul>
            <li>
              Le principe : comparer les parcours réels, au-delà de l’existence
              d’un accès.
            </li>
            <li>L’expérimentation sur des lieux pilotes.</li>
            <li>La poursuite de l’initiative ONE:ACCESS.</li>
          </ul>
          <p>
            Votre signature ne vaut pas approbation d’une formule de calcul,
            de seuils définitifs, de futures obligations réglementaires ou de
            toutes les mises en œuvre envisagées pour la suite.
          </p>
        </section>
        <div className={styles.supportActions}>
          <p id="petition-destination">
            La signature se fait sur Change.org, un site externe.
          </p>
          <LinkButton
            href="https://c.org/2Jvz4TZJfV"
            aria-describedby="petition-destination"
            target="_blank"
            rel="noreferrer"
            className={styles.cta}
          >
            Signer la pétition <ArrowUpRight aria-hidden="true" />
          </LinkButton>
          <Link href="/" className={styles.textLink}>
            <ArrowLeft aria-hidden="true" size={18} />
            Revenir au projet
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
