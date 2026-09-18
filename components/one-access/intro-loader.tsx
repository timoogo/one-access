"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { loaderAnimationConfig } from "@/config/animations/loader.config";
import styles from "./public-site.module.css";

const seenKey = "one-access-intro-seen-v1";
const INTRO_COMPLETE_EVENT = "one-access:intro-complete";

export function IntroLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const axisRef = useRef<HTMLSpanElement>(null);
  const separatorRef = useRef<HTMLSpanElement>(null);
  const dashTopRef = useRef<HTMLSpanElement>(null);
  const dashBottomRef = useRef<HTMLSpanElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const measure = measureRef.current;
    const axis = axisRef.current;
    const separator = separatorRef.current;
    const dashTop = dashTopRef.current;
    const dashBottom = dashBottomRef.current;
    const lockup = lockupRef.current;
    const note = noteRef.current;
    const backdrop = backdropRef.current;
    const headerTarget = document.querySelector<HTMLElement>(
      "[data-one-access-logo-target]",
    );
    if (
      !loader ||
      !measure ||
      !axis ||
      !separator ||
      !dashTop ||
      !dashBottom ||
      !lockup ||
      !note ||
      !backdrop
    ) {
      return;
    }

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(seenKey) === "1";
    } catch {
      // Storage can be unavailable. A single-page fallback still works.
    }

    const replayInDevelopment =
      loaderAnimationConfig.development.alwaysReplay &&
      process.env.NODE_ENV === "development";
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if ((seen && !replayInDevelopment) || reducedMotion) return;

    try {
      window.sessionStorage.setItem(seenKey, "1");
    } catch {
      // Continue with the intro when session storage is unavailable.
    }

    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    const layout = isMobile
      ? loaderAnimationConfig.layout.mobile
      : loaderAnimationConfig.layout.desktop;
    const {
      timing,
      easing,
      axis: axisConfig,
      separator: separatorConfig,
      exitTransition,
    } = loaderAnimationConfig;

    loader.classList.add(styles.introLoaderActive);
    const context = gsap.context(() => {
      const timeline = gsap.timeline();
      timeline.timeScale(timing.timeScale);

      gsap.set(measure, { width: layout.initialSeparation });
      gsap.set(axis, { scaleX: 1, autoAlpha: 1, transformOrigin: "center" });
      gsap.set(separator, { autoAlpha: 0 });
      gsap.set(dashTop, {
        width: separatorConfig.initialBarWidth,
        height: separatorConfig.initialBarHeight,
        x: -separatorConfig.initialBarOffset,
        y: 0,
        rotation: 0,
      });
      gsap.set(dashBottom, {
        width: separatorConfig.initialBarWidth,
        height: separatorConfig.initialBarHeight,
        x: separatorConfig.initialBarOffset,
        y: 0,
        rotation: 0,
      });

      timeline
        .addLabel("establish")
        .to({}, { duration: timing.initialHold })
        .addLabel("contract")
        .to(
          measure,
          {
            width: loaderAnimationConfig.layout.finalDashSeparation,
            duration: timing.contraction,
            ease: easing.contraction,
          },
          "contract",
        )
        .to(
          axis,
          {
            scaleX: axisConfig.contractionScale,
            autoAlpha: 0,
            duration: timing.contraction * axisConfig.fadeDurationRatio,
            ease: easing.contraction,
          },
          "contract+=0.18",
        )
        .addLabel("finalDash")
        .to(separator, { autoAlpha: 1, duration: 0.08 }, "finalDash")
        .to({}, { duration: timing.finalDashHold })
        .addLabel("morph")
        .to(
          [dashTop, dashBottom],
          {
            width: separatorConfig.finalDotSize,
            height: separatorConfig.finalDotSize,
            duration: timing.morph,
            ease: easing.morph,
          },
          "morph",
        )
        .to(
          dashTop,
          {
            x: 0,
            y: -separatorConfig.finalDotGap / 2,
            rotation: separatorConfig.morphRotation,
            duration: timing.morph,
            ease: easing.morph,
          },
          "morph",
        )
        .to(
          dashBottom,
          {
            x: 0,
            y: separatorConfig.finalDotGap / 2,
            rotation: separatorConfig.morphRotation,
            duration: timing.morph,
            ease: easing.morph,
          },
          "morph",
        )
        .addLabel("converge")
        .to(
          measure,
          {
            width: loaderAnimationConfig.layout.finalSeparation,
            marginLeft: loaderAnimationConfig.layout.finalInlineMargin,
            marginRight: loaderAnimationConfig.layout.finalInlineMargin,
            duration: timing.convergence,
            ease: easing.convergence,
          },
          "converge",
        )
        .addLabel("logoHold")
        .to({}, { duration: timing.logoHold })
        .addLabel("exit")
        .call(() => {
          if (!headerTarget) {
            loader.classList.remove(styles.introLoaderActive);
            window.dispatchEvent(new CustomEvent(INTRO_COMPLETE_EVENT));
            return;
          }

          const sourceRect = lockup.getBoundingClientRect();
          const targetRect = headerTarget.getBoundingClientRect();
          gsap.set(headerTarget, { autoAlpha: 0 });
          gsap.set(lockup, { transformOrigin: "top left" });
          const exitTimeline = gsap.timeline({
            onComplete: () => {
              gsap.set(headerTarget, { autoAlpha: 1 });
              loader.classList.remove(styles.introLoaderActive);
              window.dispatchEvent(new CustomEvent(INTRO_COMPLETE_EVENT));
            },
          });
          exitTimeline.timeScale(timing.timeScale);
          exitTimeline.to(backdrop, {
            clipPath: "inset(0 0 100% 0)",
            duration: exitTransition.revealDuration,
            ease: exitTransition.revealEase,
          });
          exitTimeline.to(note, {
            autoAlpha: 0,
            duration: exitTransition.metadataExitDuration,
            ease: exitTransition.ease,
          }, 0);
          exitTimeline.to(lockup, {
            x: targetRect.left - sourceRect.left,
            y: targetRect.top - sourceRect.top,
            scaleX: targetRect.width / sourceRect.width,
            scaleY: targetRect.height / sourceRect.height,
            duration: exitTransition.duration,
            ease: exitTransition.ease,
            onComplete: () => {
              const finalSourceRect = lockup.getBoundingClientRect();
              const finalTargetRect = headerTarget.getBoundingClientRect();
              const delta = {
                dx: finalTargetRect.left - finalSourceRect.left,
                dy: finalTargetRect.top - finalSourceRect.top,
                dw: finalTargetRect.width - finalSourceRect.width,
                dh: finalTargetRect.height - finalSourceRect.height,
              };
              if (process.env.NODE_ENV === "development") {
                console.debug("[ONE:ACCESS] logo handoff delta", delta);
              }
            },
          }, 0);
        });
    }, loader);

    return () => {
      context.revert();
      if (headerTarget) {
        headerTarget.style.removeProperty("opacity");
        headerTarget.style.removeProperty("visibility");
      }
      loader.classList.remove(styles.introLoaderActive);
    };
  }, []);

  return (
    <div
      ref={loaderRef}
      className={styles.introLoader}
      data-one-access-intro-loader
      aria-hidden="true"
    >
      <div ref={backdropRef} className={styles.introBackdrop} aria-hidden="true" />
      <div className={styles.introInstrument}>
        <div
          ref={lockupRef}
          className={styles.introLockup}
          data-one-access-logo-source
        >
          <span className={styles.introWord}>ONE</span>
          <span ref={measureRef} className={styles.introMeasure}>
            <span ref={axisRef} className={styles.introAxis}>
              {Array.from({ length: loaderAnimationConfig.axis.segmentCount }).map(
                (_, index) => <i key={index} />,
              )}
            </span>
            <span ref={separatorRef} className={styles.introSeparator}>
              <i ref={dashTopRef} />
              <i ref={dashBottomRef} />
            </span>
          </span>
          <span className={styles.introWord}>ACCESS</span>
        </div>
        <p ref={noteRef} className={styles.introNote}>
          Même origine · même destination
        </p>
      </div>
    </div>
  );
}
