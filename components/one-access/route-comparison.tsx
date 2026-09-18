"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { demoRoutes, pathNodes, preferredPath, places } from "@/lib/homepage-scenario/scenario";
import { getScenarioState } from "@/lib/homepage-scenario/progression";
import { checkpointRail, correspondencePoints, diagramWidth, formatDuration, routePoints, segmentDrawing } from "@/lib/homepage-scenario/presentation";
import { useRouteProgress } from "./use-route-progress";
import styles from "./public-site.module.css";

const number = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const ratio = (value: number | null) => value === null ? "—" : number.format(value);

interface PlotBounds { x: number; y: number; width: number; height: number }

function LiveMeasurementPair({ reference, compared }: { reference: string; compared: string }) {
  return (
    <>
      <span className={styles.measurementReference}>
        <span className={styles.routeTextAlternative}>Référence : </span>
        {reference} <span aria-hidden="true">/</span>
      </span>
      <span className={styles.measurementCompared}>
        <span className={styles.routeTextAlternative}>Accès adapté, valeur actuelle : </span>
        {compared}
      </span>
    </>
  );
}

export function RouteComparison({ editorial }: { editorial: ReactNode }) {
  const { rootRef, progress } = useRouteProgress();
  const state = getScenarioState(progress);
  const panelsRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<{ width: number; height: number; plots: PlotBounds[] } | null>(null);

  useEffect(() => {
    const panels = panelsRef.current;
    if (!panels) return;
    const plots = [...panels.querySelectorAll<SVGSVGElement>("[data-route-plot]")];
    const measure = () => {
      const bounds = panels.getBoundingClientRect();
      setGeometry({ width: bounds.width, height: bounds.height, plots: plots.map((plot) => {
        const rect = plot.getBoundingClientRect();
        return { x: rect.x - bounds.x, y: rect.y - bounds.y, width: rect.width, height: rect.height };
      }) });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(panels);
    plots.forEach((plot) => observer.observe(plot));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={styles.exampleStage} data-motion-route data-scenario-progress={state.progress.toFixed(3)}>
      <div className={styles.exampleGrid}>
        <div className={styles.editorialSlot}>
          <div className={styles.exampleEditorial}>{editorial}</div>
        </div>
        <div className={styles.comparison}>
          <div className={styles.comparisonInstrument}>
            <aside className={styles.checkpointRail} aria-label="Historique des points communs">
              <p className="oa-label">Points communs</p>
              <ol>
                {checkpointRail(state).map((checkpoint) => (
                  <li key={checkpoint.nodeId} data-checkpoint-node={checkpoint.nodeId} data-active={checkpoint.active}>
                    <span className={styles.checkpointLabel}>{checkpoint.label}</span>
                    <span className={styles.routeTextAlternative}>{checkpoint.active ? " — atteint par les deux parcours" : " — comparaison à venir"}</span>
                    {checkpoint.comparison && (
                      <div data-checkpoint-comparison={checkpoint.nodeId}>
                        <span className={styles.checkpointRatio}>× {ratio(checkpoint.comparison.timeRatio)} <span className={styles.checkpointDimension}>T</span></span>
                        <span className={styles.checkpointRatio}>× {ratio(checkpoint.comparison.distanceRatio)} <span className={styles.checkpointDimension}>D</span></span>
                        <span className={styles.routeTextAlternative}>
                          À l’arrivée : référence {formatDuration(checkpoint.comparison.reference.seconds)}, {number.format(checkpoint.comparison.reference.meters)} m ;
                          accès adapté {formatDuration(checkpoint.comparison.compared.seconds)}, {number.format(checkpoint.comparison.compared.meters)} m.
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </aside>
            <div className={styles.comparisonBody}>
      <div ref={panelsRef} className={styles.routePanels}>
        {geometry && geometry.plots.length === 2 && (
          <svg className={styles.routeCorrespondences} viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true" focusable="false">
            {correspondencePoints(state.sharedReachedNodes, state.spatialReveal).map(({ id, from, to }) => {
              const [first, second] = geometry.plots;
              return <line key={id} data-shared-node={id}
                x1={first.x + from.x / diagramWidth * first.width}
                y1={first.y + from.y / 120 * first.height}
                x2={second.x + to.x / diagramWidth * second.width}
                y2={second.y + to.y / 120 * second.height}
                opacity={state.spatialReveal}
              />;
            })}
          </svg>
        )}
        {demoRoutes.map((route, index) => {
          const routeIndex = index as 0 | 1;
          const current = index === 0 ? state.reference : state.compared;
          const plotWidth = geometry?.plots[index]?.width || diagramWidth;
          const points = routePoints(routeIndex, state.spatialReveal, plotWidth);
          return (
            <article key={route.comparedPath.pathId} className={styles.route}>
              <div className={styles.routeHeading}>
                <span className="oa-label">Parcours 0{index + 1}</span>
                <h3>{route.title}</h3>
              </div>
              <div className={styles.routeDiagram}>
              <svg data-route-plot viewBox={`0 0 ${plotWidth} 120`} preserveAspectRatio="none" className={styles.routePlot} aria-hidden="true" focusable="false">
                {points.slice(1).map((point, segment) => (
                  <g key={`${points[segment].id}/${point.id}`}>
                    <path className={styles.routeTrack} d={segmentDrawing(points[segment], point)} />
                    <path className={styles.routeTravelled} d={segmentDrawing(points[segment], point)}
                      pathLength="1" strokeDasharray="1" strokeDashoffset={1 - Math.max(0, Math.min(1, current.cursor - segment))} />
                  </g>
                ))}
                {points.map((point) => (
                  <g key={point.id} data-route-node={point.id} data-reached={current.reachedNodes.includes(point.id)}>
                    {current.reachedNodes.includes(point.id) && <rect x={point.x - 3} y={point.y - 3} width="6" height="6" className={styles.routeNode} />}
                    <text x={point.x} y={point.labelY} textAnchor={point.labelAnchor} className={styles.desktopNodeLabel}>{point.label}</text>
                    <text x={point.x} y={point.labelY + 4} textAnchor={point.labelAnchor} className={styles.mobileNodeLabel}>{point.shortLabel}</text>
                  </g>
                ))}
              </svg>
              </div>
              <ol className={styles.routeTextAlternative} aria-label={`Étapes — ${route.title}`}>
                {pathNodes(preferredPath(route)).map((id) => <li key={id}>
                  {Object.values(places).find((place) => place.id === id)!.label}
                  {current.reachedNodes.includes(id) ? " — atteint" : " — à venir"}
                </li>)}
              </ol>
              <p className={styles.routeActivity}>{current.activity}</p>
              <dl className={styles.metrics}>
                <div><dt>Temps</dt><dd>{index === 0 ? (
                  <LiveMeasurementPair reference={formatDuration(current.seconds)} compared={formatDuration(state.compared.seconds)} />
                ) : formatDuration(current.seconds)}</dd></div>
                <div><dt>Distance</dt><dd>{index === 0 ? (
                  <LiveMeasurementPair reference={`${number.format(current.meters)} m`} compared={`${number.format(state.compared.meters)} m`} />
                ) : `${number.format(current.meters)} m`}</dd></div>
                <div><dt>Autonomie</dt><dd>{current.assisted ? "Assistance obligatoire" : index === 0 ? "Sans assistance" : "Sans aide à ce stade"}</dd></div>
              </dl>
            </article>
          );
        })}
      </div>
      <div className={styles.routeConclusion}>
        <strong>× {ratio(state.timeRatio)} <span>de temps</span></strong>
        <strong>× {ratio(state.distanceRatio)} <span>de distance</span></strong>
        <p>Un accès existe. L’autonomie, elle, n’est pas équivalente.</p>
      </div>
      <p className={styles.note}>
        Traits de liaison : même lieu physique, pas même instant. C : palier commun ; F : foyer commun. Schéma non à l’échelle.
        Repères T / D : rapports de temps / distance à l’arrivée de chaque parcours au même point.
        Les deux parcours avancent à des rythmes de démonstration distincts.
      </p>
      <p className={styles.note}>
        Scénario fictif illustratif. Ces rapports décrivent le temps et la
        distance parcourus à ce stade ; ils ne constituent pas un score global ONE:ACCESS.
        L’effort, les obstacles et la dépendance doivent aussi être évalués.
      </p>
      <p className={styles.routeTextAlternative}>
        Bilan illustratif complet : trajet de référence, 2 minutes et 80 mètres sans assistance.
        Accès adapté, 12 minutes et 240 mètres avec attente et intervention obligatoire du personnel.
        Six fois plus de temps, trois fois plus de distance.
      </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
