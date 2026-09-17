import styles from "./public-site.module.css";

const routes = [
  {
    title: "Trajet de référence",
    steps: ["A · Entrée", "Accès direct", "B · Salle"],
    time: "2 min",
    distance: "80 m",
    autonomy: "Sans assistance",
  },
  {
    title: "Trajet avec accès adapté",
    steps: [
      "A · Entrée",
      "Ascenseur",
      "Attente",
      "Intervention du personnel",
      "Second élévateur",
      "B · Salle",
    ],
    time: "12 min",
    distance: "240 m",
    autonomy: "Assistance obligatoire",
  },
];

export function RouteComparison() {
  return (
    <div className={styles.comparison}>
      {routes.map((route, index) => (
        <article key={route.title} className={styles.route}>
          <div className={styles.routeHeading}>
            <span className="oa-label">Parcours 0{index + 1}</span>
            <h3>{route.title}</h3>
          </div>
          <ol className={styles.routeSteps}>
            {route.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <dl className={styles.metrics}>
            <div>
              <dt>Temps</dt>
              <dd>{route.time}</dd>
            </div>
            <div>
              <dt>Distance</dt>
              <dd>{route.distance}</dd>
            </div>
            <div>
              <dt>Autonomie</dt>
              <dd>{route.autonomy}</dd>
            </div>
          </dl>
        </article>
      ))}
      <div className={styles.routeConclusion}>
        <strong>
          × 6 <span>de temps</span>
        </strong>
        <strong>
          × 3 <span>de distance</span>
        </strong>
        <p>Un accès existe. L’autonomie, elle, n’est pas équivalente.</p>
      </div>
      <p className={styles.note}>
        Scénario fictif illustratif. Ces rapports décrivent le temps et la
        distance ; ils ne constituent pas un score global ONE:ACCESS. L’effort,
        les obstacles et la dépendance doivent aussi être évalués.
      </p>
    </div>
  );
}
