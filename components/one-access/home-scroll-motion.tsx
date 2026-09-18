"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimationConfig } from "@/config/animations/scroll.config";
import styles from "./public-site.module.css";

const INTRO_COMPLETE_EVENT = "one-access:intro-complete";

gsap.registerPlugin(ScrollTrigger);

export function HomeScrollMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const { timing, offsets, easing, trigger } = scrollAnimationConfig;
    const context = gsap.context(() => {
      const sectionDefaults = {
        once: true,
        start: trigger.start,
      };

      root.querySelectorAll<HTMLElement>("[data-motion-section]").forEach(
        (section) => {
          const label = section.querySelector<HTMLElement>("[data-motion-label]");
          const heading = section.querySelector<HTMLElement>("h2");
          const copy = section.querySelectorAll<HTMLElement>(
            ":scope > div > div > p, [data-motion-copy]",
          );
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: section, ...sectionDefaults },
          });

          if (label) {
            gsap.set(label, { clipPath: "inset(0 100% 0 0)" });
            timeline.to(label, {
              clipPath: "inset(0 0% 0 0)",
              duration: timing.label,
              ease: easing.structure,
            });
          }
          if (heading) {
            gsap.set(heading, { clipPath: "inset(0 0 100% 0)", y: offsets.heading });
            timeline.to(
              heading,
              {
                clipPath: "inset(0 0 0 0)",
                y: 0,
                duration: timing.heading,
                ease: easing.headline,
              },
              "-=0.2",
            );
          }
          if (copy.length) {
            gsap.set(copy, { autoAlpha: 0, y: offsets.copy });
            timeline.to(
              copy,
              {
                autoAlpha: 1,
                y: 0,
                duration: timing.copy,
                ease: easing.reveal,
                stagger: 0.05,
              },
              "-=0.3",
            );
          }
        },
      );

      root.querySelectorAll<HTMLElement>("[data-motion-card]").forEach(
        (card) => {
          const cards = card.parentElement?.querySelectorAll<HTMLElement>(
            "[data-motion-card]",
          );
          if (!cards || card !== cards[0]) return;
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: card.parentElement, ...sectionDefaults },
          });
          gsap.set(cards, { clipPath: "inset(0 0 100% 0)" });
          timeline.to(cards, {
            clipPath: "inset(0 0 0 0)",
            duration: timing.cards,
            ease: easing.reveal,
            stagger: timing.cardStagger,
          });
        },
      );

      root.querySelectorAll<HTMLElement>("[data-motion-scale]").forEach((scale) => {
        const axis = scale.querySelector<HTMLElement>("[data-motion-scale-axis]");
        const markers = scale.querySelectorAll<HTMLElement>(
          "[data-motion-scale-marker]",
        );
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: scale, ...sectionDefaults },
        });
        if (axis) {
          timeline.to(axis, {
            scaleX: 1,
            duration: timing.scaleAxis,
            ease: easing.route,
          });
        }
        gsap.set(markers, { autoAlpha: 0, y: offsets.process });
        timeline.to(markers, {
          autoAlpha: 1,
          y: 0,
          duration: timing.scaleMarkers,
          ease: easing.reveal,
          stagger: timing.cardStagger,
        }, "-=0.18");
      });

      root.querySelectorAll<HTMLElement>("[data-motion-process]").forEach((process) => {
        const items = process.querySelectorAll<HTMLElement>("[data-motion-process-item]");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: process, ...sectionDefaults },
        });
        gsap.set(items, { clipPath: "inset(0 0 100% 0)" });
        timeline.to(items, {
          clipPath: "inset(0 0 0 0)",
          duration: timing.process,
          ease: easing.reveal,
          stagger: timing.cardStagger,
        });
      });

      root.querySelectorAll<HTMLElement>("[data-motion-strategy]").forEach((strategy) => {
        const strategies = strategy.parentElement?.querySelectorAll<HTMLElement>(
          "[data-motion-strategy]",
        );
        if (!strategies || strategy !== strategies[0]) return;
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: strategy.parentElement, ...sectionDefaults },
        });
        gsap.set(strategies, { autoAlpha: 0, x: offsets.process });
        timeline.to(strategies, {
          autoAlpha: 1,
          x: 0,
          duration: timing.process,
          ease: easing.reveal,
          stagger: timing.cardStagger,
        });
      });

      root.querySelectorAll<HTMLElement>("[data-motion-process-line]").forEach((process) => {
        const items = process.querySelectorAll<HTMLElement>(":scope > li");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: process, ...sectionDefaults },
        });
        gsap.set(items, { autoAlpha: 0, x: offsets.process });
        timeline.to(items, {
          autoAlpha: 1,
          x: 0,
          duration: timing.process,
          ease: easing.reveal,
          stagger: timing.cardStagger,
        });
      });

      const support = root.querySelector<HTMLElement>("[data-motion-support]");
      if (support) {
        const label = support.querySelector<HTMLElement>(".oa-label");
        const heading = support.querySelector<HTMLElement>("h2");
        const copy = support.querySelector<HTMLElement>("p:last-of-type");
        const cta = support.querySelector<HTMLElement>("a");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: support, ...sectionDefaults },
        });
        gsap.set([label, heading].filter(Boolean), { clipPath: "inset(0 0 100% 0)" });
        gsap.set([copy, cta].filter(Boolean), { autoAlpha: 0, y: offsets.copy });
        timeline
          .to([label, heading].filter(Boolean), {
            clipPath: "inset(0 0 0 0)",
            duration: timing.label,
            ease: easing.structure,
            stagger: timing.cardStagger,
          })
          .to([copy, cta].filter(Boolean), {
            autoAlpha: 1,
            y: 0,
            duration: timing.support,
            ease: easing.reveal,
            stagger: timing.cardStagger,
          }, "-=0.15");
      }

      root.querySelectorAll<HTMLElement>("[data-motion-footer]").forEach((footer) => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: footer, ...sectionDefaults },
        });
        gsap.set(footer, { clipPath: "inset(100% 0 0 0)" });
        timeline.to(footer, {
          clipPath: "inset(0 0 0 0)",
          duration: timing.label,
          ease: easing.structure,
        });
      });
    }, root);

    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener(INTRO_COMPLETE_EVENT, refresh, { once: true });
    refresh();

    return () => {
      window.removeEventListener(INTRO_COMPLETE_EVENT, refresh);
      context.revert();
    };
  }, []);

  return <div ref={rootRef} className={styles.homeMotion}>{children}</div>;
}
