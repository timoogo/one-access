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

      root.querySelectorAll<HTMLElement>("[data-motion-route]").forEach((route) => {
        const panels = route.querySelectorAll<HTMLElement>("[data-motion-route-panel]");
        const stepGroups = route.querySelectorAll<HTMLElement>("[data-motion-route-steps]");
        const metrics = route.querySelectorAll<HTMLElement>("[data-motion-route-metrics]");
        const conclusion = route.querySelector<HTMLElement>("[data-motion-route-conclusion]");
        const routeConfig = scrollAnimationConfig.routeComparison;
        const routeTrigger = routeConfig.trigger;
        const routeTimeline = routeConfig.timeline;
        const routeMotion = routeConfig.motion;
        const routeVisual = routeConfig.visual;
        const isMobile = window.matchMedia(
          `(max-width: ${routeTrigger.mobileBreakpoint}px)`,
        ).matches;
        route.style.setProperty(
          "--oa-route-vertical-offset",
          `${routeVisual.verticalOffsetPx}px`,
        );
        route.style.setProperty(
          "--oa-route-grid-opacity",
          String(routeVisual.gridOpacity),
        );
        route.style.setProperty(
          "--oa-route-header-space",
          `${isMobile ? routeVisual.headerSpacePx.mobile : routeVisual.headerSpacePx.desktop}px`,
        );
        route.style.setProperty(
          "--oa-route-max-width",
          `${isMobile ? routeVisual.comparatorMaxWidth.mobile : routeVisual.comparatorMaxWidth.desktop}px`,
        );
        route.style.setProperty(
          "--oa-route-bleed-width",
          `${isMobile ? 0 : routeVisual.desktopBleedPx * 2}px`,
        );
        route.style.setProperty(
          "--oa-route-bleed-margin",
          `${isMobile ? 0 : -routeVisual.desktopBleedPx}px`,
        );
        let lastProgressLog = -Infinity;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: route,
            start: routeTrigger.start,
            end: () => {
              const isMobile = window.matchMedia(
                `(max-width: ${routeTrigger.mobileBreakpoint}px)`,
              ).matches;
              const scrollDistanceVh = isMobile
                ? routeTrigger.scrollDistanceVh.mobile
                : routeTrigger.scrollDistanceVh.desktop;
              return `+=${(window.innerHeight * scrollDistanceVh) / 100}`;
            },
            scrub: routeTrigger.scrub,
            pin: routeTrigger.pin,
            pinSpacing: routeTrigger.pinSpacing,
            anticipatePin: routeTrigger.anticipatePin,
            invalidateOnRefresh: true,
            markers:
              process.env.NODE_ENV === "development" && routeConfig.debug.markers,
            onUpdate: (self) => {
              route.style.setProperty("--oa-route-progress", self.progress.toFixed(3));
              if (
                process.env.NODE_ENV === "development" &&
                routeConfig.debug.logProgress &&
                performance.now() - lastProgressLog >= routeConfig.debug.logIntervalMs
              ) {
                lastProgressLog = performance.now();
                console.debug("[ONE:ACCESS] route progress", self.progress.toFixed(3));
              }
            },
          },
        });
        const routeStepGroups = [stepGroups[0], stepGroups[1]].filter(
          (group): group is HTMLElement => Boolean(group),
        );
        gsap.set(panels, { clipPath: "inset(0 0 100% 0)" });
        gsap.set(routeStepGroups, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(metrics, { autoAlpha: 0, y: offsets.copy });
        if (conclusion) gsap.set(conclusion, { autoAlpha: 0, y: offsets.copy });

        timeline
          .addLabel("origin", 0)
          .to(panels[0], {
            clipPath: "inset(0 0 0 0)",
            duration: routeMotion.panelRevealDuration,
            ease: easing.reveal,
          }, routeTimeline.routesStart)
          .to(panels[1], {
            clipPath: "inset(0 0 0 0)",
            duration: routeMotion.panelRevealDuration,
            ease: easing.reveal,
          }, routeTimeline.routesStart)
          .to(stepGroups[0], {
            clipPath: "inset(0 0% 0 0)",
            duration: routeTimeline.referenceComplete - routeTimeline.routesStart,
            ease: easing.route,
          }, routeTimeline.routesStart)
          .to(stepGroups[1], {
            clipPath: "inset(0 0% 0 0)",
            duration: routeTimeline.adaptedComplete - routeTimeline.routesStart,
            ease: easing.route,
          }, routeTimeline.routesStart)
          .to(metrics[0], {
            autoAlpha: 1,
            y: 0,
            duration: routeMotion.metricsDuration,
            ease: easing.reveal,
          }, routeTimeline.referenceMetricsStart)
          .to(metrics[1], {
            autoAlpha: 1,
            y: 0,
            duration: routeMotion.metricsDuration,
            ease: easing.reveal,
          }, routeTimeline.adaptedMetricsStart);

        if (conclusion) {
          timeline.to(conclusion, {
            autoAlpha: 1,
            y: 0,
            duration: routeMotion.conclusionDuration,
            ease: easing.reveal,
          }, routeTimeline.conclusionStart);
        }
        timeline.to(
          {},
          { duration: routeTimeline.release - routeTimeline.finalHoldStart },
          routeTimeline.finalHoldStart,
        );
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

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.querySelector<HTMLElement>("#exemple");
    const fill = section?.querySelector<HTMLElement>("[data-motion-example-progress]");
    if (!root || !section || !fill) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(fill, { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });
    }, root);

    return () => media.revert();
  }, []);

  return <div ref={rootRef} className={styles.homeMotion}>{children}</div>;
}
