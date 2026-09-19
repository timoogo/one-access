"use client";
import { scenes } from "@/config/animations/philosophy.config";
import { connectorPath, route } from "@/lib/philosophy-world/world";
import { fullNarrative, introQuestion, sceneText } from "@/lib/philosophy-world/content";
import { usePhilosophyScroll } from "./use-philosophy-scroll";
import styles from "./philosophy-world.module.css";

export function PhilosophyWorld() {
  const { rootRef, stageRef, skipAnimation } = usePhilosophyScroll();
  return (
    <div ref={rootRef} className={styles.philosophy} data-mode="static">
      <div ref={stageRef} className={styles.stage} data-philosophy-stage aria-label="Parcours animé ONE:ACCESS">
        <div data-camera className={styles.camera} aria-hidden="true">
          <svg className={styles.worldSvg} width="3300" height="2500" aria-hidden="true" focusable="false">
            <path data-route d={route.d} className={styles.route} />
            <path data-replay-route d={route.d} className={styles.replayRoute} />
            <path data-exit-route className={styles.route} />
            {scenes.map(scene => (
              <g key={scene.id}>
                <path data-connector={scene.id} d={connectorPath(scene)} className={styles.connector} />
                <rect data-marker={scene.id} x={scene.node.x - 9} y={scene.node.y - 9} width="18" height="18"
                  rx={scene.kind === "endpoint" ? 9 : 0}
                  transform={scene.kind === "pillar" ? `rotate(45 ${scene.node.x} ${scene.node.y})` : undefined}
                  className={scene.kind === "pillar" ? styles.diamond : styles.marker} />
              </g>
            ))}
            <rect data-cursor width="12" height="12" rx="6" className={styles.cursor} />
          </svg>
          {scenes.map(scene => {
            const text = sceneText(scene);
            const box = scene.annotation.text;
            const style = { left: scene.node.x + box.x, top: scene.node.y + box.y, width: box.width, height: box.height };
            return <div key={scene.id}>
              <div data-annotation={scene.id} className={styles.annotation} style={style}>
                {text.kicker && <p className={styles.kicker}>{text.kicker}</p>}
                {text.body && <p className={styles.body}>{text.body}</p>}
              </div>
              <div data-recap={scene.id} className={styles.recap} style={style}>
                <p>{scene.kind === "pillar" ? "◇ " : scene.kind === "info" ? "■ " : ""}{text.short}</p>
              </div>
            </div>;
          })}
        </div>
        <div className={styles.nodeNavigation} role="group" aria-label="Revenir à une étape parcourue">
          {scenes.map(scene => {
            const text = sceneText(scene);
            const name = scene.kind === "pillar" ? `Revenir au pilier ${text.body}` : scene.kind === "info" ? `Revenir à l’information ${scene.pillarNumber ? text.short : text.kicker}` : `Revenir à ${text.short}`;
            return <button key={scene.id} type="button" data-node={scene.id} className={styles.nodeButton}
              aria-label={name} disabled tabIndex={-1}><span className="sr-only">{name}</span></button>;
          })}
        </div>
        <div data-question className={styles.question} aria-hidden="true">
          <p className={styles.mast}>{introQuestion.mast.join(" ")}</p>
          <p className={styles.questionText}>{introQuestion.question.map(line => <span key={line}>{line}</span>)}</p>
          <p className={styles.mast}>{introQuestion.cue}</p>
        </div>
        <p data-overview-tooltip className={styles.overviewTooltip} aria-hidden="true">Vue d’ensemble</p>
        <button type="button" className={styles.skip} onClick={skipAnimation}>
          Passer l’animation <span aria-hidden="true">↘</span>
        </button>
      </div>
      <article className={styles.narrative}>
        {fullNarrative.map((section, i) => <section key={section.heading}>
          {i === 0 ? <h1>{section.heading}</h1> : <h2>{section.heading}</h2>}
          {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </section>)}
        <ol className={styles.sceneTranscript} aria-label="Annotations du parcours">
          {scenes.map(scene => {
            const text = sceneText(scene);
            return <li key={scene.id}><strong>{text.kicker || text.short}</strong>{text.body && ` — ${text.body}`}</li>;
          })}
        </ol>
      </article>
    </div>
  );
}
