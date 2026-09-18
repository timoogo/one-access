"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { heroAnimationConfig } from "@/config/animations/hero.config";
import styles from "./public-site.module.css";

const INTRO_COMPLETE_EVENT = "one-access:intro-complete";

export function HeroMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let cleanupAnimation: (() => void) | undefined;
    let initialized = false;

    const initialize = () => {
      if (initialized) return;
      initialized = true;

      const structure = root.querySelectorAll<HTMLElement>(
        "[data-hero-structure]",
      );
      const image = root.querySelector<HTMLElement>("[data-hero-image]");
      const headline = root.querySelector<HTMLElement>("[data-hero-headline]");
      const support = root.querySelectorAll<HTMLElement>("[data-hero-support]");
      const actions = root.querySelector<HTMLElement>("[data-hero-cta]");
      if (!image || !headline || !actions) return;

      const { timing, offsets, easing, image: imageConfig } =
        heroAnimationConfig;
      const context = gsap.context(() => {
        gsap.set(structure, {
          clipPath: "inset(0 100% 0 0)",
          transformOrigin: "left center",
        });
        gsap.set(image, {
          clipPath: imageConfig.initialClip,
        });
        gsap.set(headline, {
          clipPath: "inset(0 0 100% 0)",
          y: offsets.headline,
        });
        gsap.set(support, { autoAlpha: 0, y: offsets.support });
        gsap.set(actions, { autoAlpha: 0, y: offsets.actions });

        const timeline = gsap.timeline();
        timeline.timeScale(heroAnimationConfig.timeScale);
        timeline
          .to(
            structure,
            {
              clipPath: "inset(0 0% 0 0)",
              duration: timing.structure,
              ease: easing.structure,
              stagger: heroAnimationConfig.stagger,
            },
            0,
          )
          .to(
            image,
            {
              clipPath: imageConfig.finalClip,
              duration: timing.image,
              ease: easing.image,
            },
            0.08,
          )
          .to(
            headline,
            {
              clipPath: "inset(0 0 0 0)",
              y: 0,
              duration: timing.headline,
              ease: easing.headline,
            },
            0.16,
          )
          .to(
            support,
            {
              autoAlpha: 1,
              y: 0,
              duration: timing.support,
              ease: easing.support,
              stagger: heroAnimationConfig.stagger,
            },
            0.42,
          )
          .to(
            actions,
            {
              autoAlpha: 1,
              y: 0,
              duration: timing.actions,
              ease: easing.support,
            },
            0.56,
          )
          .to(
            root.querySelectorAll<HTMLElement>("[data-hero-footnote]"),
            {
              autoAlpha: 1,
              y: 0,
              duration: timing.footnote,
              ease: easing.support,
            },
            0.64,
          );
      }, root);
      cleanupAnimation = () => context.revert();
    };

    const onIntroComplete = () => initialize();
    window.addEventListener(INTRO_COMPLETE_EVENT, onIntroComplete);

    const introLoader = document.querySelector<HTMLElement>(
      "[data-one-access-intro-loader]",
    );
    if (!introLoader || getComputedStyle(introLoader).display === "none") {
      requestAnimationFrame(initialize);
    } else {
      requestAnimationFrame(() => {
        if (getComputedStyle(introLoader).display === "none") initialize();
      });
    }

    return () => {
      window.removeEventListener(INTRO_COMPLETE_EVENT, onIntroComplete);
      cleanupAnimation?.();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.heroMotion}>
      {children}
    </div>
  );
}
