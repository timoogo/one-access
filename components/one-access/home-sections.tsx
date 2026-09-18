import Image from "next/image";
import heroImage from "@/public/images/hero.png";
import {
  ArrowDown,
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  Eye,
  Focus,
  Settings2,
  Users,
} from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import {
  measurementBenefits,
  placeCategories,
  situations,
} from "@/lib/one-access-content";
import {
  ArchitecturalFrame,
  DifferentialScale,
  SupportLink,
  TechnicalSectionLabel,
} from "./primitives";
import { PlacePriorityList } from "./place-priority-list";
import { RouteComparison } from "./route-comparison";
import styles from "./public-site.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <figure className={styles.heroPhotograph} data-hero-image>
        <Image
          src={heroImage}
          alt="Rampe d’accès bordée de garde-corps, le long d’un mur en béton traversé par une lumière diagonale."
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 53vw, (max-width: 1440px) 51vw, 735px"
          loading="eager"
          fetchPriority="high"
          className={styles.heroImage}
        />
        <figcaption>Architecture / Lumière / Parcours</figcaption>
      </figure>
      <div className={styles.heroContent}>
        <p className="oa-label" data-hero-structure>
          Mesurer l’accessibilité vécue{" "}
          <span className={styles.signal} aria-hidden="true" />
        </p>
        <h1 id="hero-title" data-hero-headline>
          Même
          <br />
          destination.
          <br />
          <span>
            Des parcours
            <br />
            différents.
          </span>
        </h1>
        <p className={styles.heroDescription} data-hero-support>
          ONE:ACCESS mesure l’écart réel entre un trajet de référence et le
          trajet vécu par différents usagers.
        </p>
        <div className={styles.heroActions} data-hero-cta>
          <LinkButton href="#methodologie" className={styles.cta}>
            Découvrir le référentiel <ArrowRight aria-hidden="true" />
          </LinkButton>
          <a href="#concept" className={styles.textLink}>
            Comprendre le concept <ArrowDown aria-hidden="true" size={18} />
          </a>
        </div>
        <p className={styles.heroFootnote} data-hero-footnote>
          Un projet de standard. Une autre lecture de l’accessibilité.
        </p>
      </div>
      <p className={styles.heroAnnotation} data-hero-structure>
        Même origine.
        <br />
        Même destination.
        <br />
        <span>Quelle différence ?</span>
      </p>
    </section>
  );
}

export function ConceptSection() {
  return (
    <section
      id="concept"
      className={styles.section}
      aria-labelledby="concept-title"
      data-motion-section
    >
      <TechnicalSectionLabel
        number="01"
        note="Même A → B · expériences multiples"
      >
        Le concept
      </TechnicalSectionLabel>
      <div className={styles.conceptGrid}>
        <div>
          <h2 id="concept-title">
            Un même trajet.
            <br />
            <span>Plusieurs situations.</span>
          </h2>
          <p>
            Une entrée, une destination. Entre les deux, la distance, le temps
            et l’autonomie peuvent radicalement changer.
          </p>
          <p>
            Le but n’est pas d’imposer un chemin identique, mais de réduire les
            écarts injustifiés.
          </p>
          <div
            className={styles.ab}
            data-motion-ab
            aria-label="Une même origine A, une même destination B"
          >
            <span>A</span>
            <i aria-hidden="true" />
            <ArrowRight aria-hidden="true" />
            <span>B</span>
          </div>
        </div>
        <div>
          <ol className={styles.situations}>
            {situations.map((situation, index) => (
              <li key={situation.title} data-motion-card>
                <span className={styles.situationIndex}>
                  0{index + 1}
                  <i aria-hidden="true" />
                </span>
                <h3>{situation.title}</h3>
                <p>{situation.detail}</p>
              </li>
            ))}
          </ol>
          <p className={styles.note}>
            Premier périmètre : les différentiels de mobilité. Les autres
            situations appellent des critères spécifiques, pas une métrique
            unique.
          </p>
        </div>
      </div>
    </section>
  );
}

export function MethodologySection() {
  return (
    <section
      id="methodologie"
      className={styles.section}
      aria-labelledby="method-title"
      data-motion-section
    >
      <TechnicalSectionLabel
        number="02"
        note="Modèle conceptuel · seuils de travail"
      >
        Les différentiels d’accessibilité
      </TechnicalSectionLabel>
      <div className={styles.scaleGrid}>
        <div>
          <h2 id="method-title">
            Une échelle
            <br />
            pour mesurer
            <br />
            <span>les écarts.</span>
          </h2>
          <p>
            Plus le score augmente, plus l’écart entre le trajet de référence et
            le parcours vécu est important.
          </p>
        </div>
        <DifferentialScale />
      </div>
      <div className={styles.methodNote}>
        <span className="oa-label">
          Temps / Distance / Effort / Autonomie / Obstacles
        </span>
        <p>
          Une proposition en développement : les seuils et la méthode de calcul
          restent à définir et à valider. Cette échelle n’est ni une norme
          officielle, ni une classification scientifique ou réglementaire.
        </p>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  const icons = [Eye, ChartNoAxesColumnIncreasing, Settings2, Users, Focus];
  return (
    <section
      className={styles.section}
      aria-labelledby="benefits-title"
      data-motion-section
    >
      <TechnicalSectionLabel number="03" note="Des observations aux décisions">
        Pourquoi le différentiel compte
      </TechnicalSectionLabel>
      <div className={styles.benefitsGrid}>
        <div>
          <h2 id="benefits-title">
            Révéler.
            <br />
            Prioriser.
            <br />
            <span>Agir.</span>
          </h2>
          <a href="#exemple" className={styles.textLink}>
            Voir un exemple <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <ol className={styles.benefits} data-motion-process>
          {measurementBenefits.map((benefit, index) => {
            const Icon = icons[index];
            return (
              <li key={benefit.title} data-motion-process-item>
                <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function ExampleSection() {
  return (
    <section
      id="exemple"
      className={`${styles.section} ${styles.exampleSection}`}
      aria-labelledby="example-title"
      data-motion-section
    >
      <div className={styles.exampleProgressRail} aria-hidden="true">
        <span className={styles.exampleProgressFill} data-motion-example-progress />
      </div>
      <TechnicalSectionLabel
        number="04"
        note="Scénario illustratif · aucun lieu réel"
      >
        Le parcours à l’épreuve du réel
      </TechnicalSectionLabel>
      <RouteComparison editorial={
        <div>
          <h2 id="example-title">
            L’accès existe.
            <br />
            <span>À quel prix ?</span>
          </h2>
          <p data-motion-copy>
            Rejoindre une salle depuis l’entrée d’un bâtiment. Un trajet direct
            pour les uns ; deux appareils de levage et l’aide du personnel pour
            les autres.
          </p>
          <p data-motion-copy>
            « Accessible » ou « non accessible » ne suffit pas à décrire cette
            expérience.
          </p>
          <ArchitecturalFrame compact />
        </div>
      } />
    </section>
  );
}

export function ApplicationsSection() {
  return (
    <section
      id="applications"
      className={`${styles.section} ${styles.applicationsSection}`}
      aria-labelledby="applications-title"
      data-motion-section
    >
      <TechnicalSectionLabel
        number="05"
        note="D’abord les constructions neuves, puis les lieux essentiels du quotidien"
      >
        Où l’appliquer en priorité
      </TechnicalSectionLabel>
      <div className={styles.applicationsGrid}>
        <div className={styles.applicationsIntro}>
          <h2 id="applications-title">
            Des lieux
            <br />
            pour tous,
            <br />
            <span>aujourd’hui.</span>
          </h2>
          <p>
            Notre proposition : commencer là où les écarts peuvent être évités
            avant de construire, puis là où ils limitent le plus l’autonomie au
            quotidien.
          </p>
        </div>
        <article className={`${styles.application} ${styles.applicationStart}`} data-motion-strategy>
          <span className={styles.applicationNumber}>01</span>
          <h3>Constructions neuves</h3>
          <p className={styles.applicationAim}>
            Intégrer ONE:ACCESS dès la conception.
          </p>
          <p>
            Comparer les parcours sur plan pour repérer les écarts
            d’accessibilité évitables avant qu’ils ne s’inscrivent dans le bâti.
          </p>
        </article>
        <article className={styles.application} data-motion-strategy>
          <span className={styles.applicationNumber}>02</span>
          <h3>Lieux à accessibilité prioritaire</h3>
          <p className={styles.applicationAim}>
            Étendre progressivement la mesure aux lieux essentiels du quotidien.
          </p>
          <p>
            Dans l’existant, privilégier les lieux où les écarts d’accès pèsent
            directement sur l’autonomie.
          </p>
          <PlacePriorityList
            categories={placeCategories}
            sectionNumber="05.02"
          />
        </article>
      </div>
      <div className={styles.applicationProcess}>
        <p className="oa-label">Une fois ONE:ACCESS appliqué à un lieu</p>
        <ol className={styles.process} data-motion-process-line>
          {[
            "Mesurer",
            "Identifier la cause",
            "Trouver une adaptation",
            "Réduire l’écart",
            "Améliorer l’autonomie",
          ].map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function SupportSection() {
  return (
    <section
      className={styles.support}
      aria-labelledby="support-title"
      data-motion-support
    >
      <div
        className={`oa-stripes ${styles.supportStripes}`}
        aria-hidden="true"
      />
      <div>
        <p className="oa-label">Un projet à construire ensemble</p>
        <h2 id="support-title">
          Même destination.
          <br />
          Plus d’autonomie.
        </h2>
        <p>Contribuez à faire émerger une mesure de l’accessibilité réelle.</p>
      </div>
      <SupportLink />
    </section>
  );
}
