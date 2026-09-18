"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimationConfig } from "@/config/animations/scroll.config";

gsap.registerPlugin(ScrollTrigger);

export function useRouteProgress() {
  const rootRef = useRef<HTMLDivElement>(null);
  // Server rendering, no JavaScript and reduced motion all expose the complete story.
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const section = root.closest("section");
    const { trigger, visual, debug } = scrollAnimationConfig.routeComparison;
    const media = gsap.matchMedia();
    let frame = 0;

    const publish = (value: number) => {
      setProgress(value);
      section?.style.setProperty("--example-progress", String(value));
    };

    media.add({
      reduced: "(prefers-reduced-motion: reduce)",
      mobile: `(max-width: ${trigger.mobileBreakpoint}px)`,
      desktop: `(min-width: ${trigger.mobileBreakpoint + 1}px)`,
    }, (context) => {
      const mobile = Boolean(context.conditions?.mobile);
      gsap.set(root, {
        "--oa-route-vertical-offset": `${visual.verticalOffsetPx}px`,
        "--oa-route-grid-opacity": visual.gridOpacity,
        "--oa-route-header-space": `${mobile ? visual.headerSpacePx.mobile : visual.headerSpacePx.desktop}px`,
        "--oa-route-max-width": `${mobile ? visual.comparatorMaxWidth.mobile : visual.comparatorMaxWidth.desktop}px`,
        "--oa-route-bleed-width": `${mobile ? 0 : visual.desktopBleedPx * 2}px`,
        "--oa-route-bleed-margin": `${mobile ? 0 : -visual.desktopBleedPx}px`,
      });
      if (context.conditions?.reduced) {
        publish(1);
        return;
      }

      let animation: gsap.core.Tween | undefined;
      let resizeTimer: ReturnType<typeof setTimeout>;
      const rebuild = context.add("rebuildRoute", () => {
        animation?.revert();
        const position = { progress: 0 };
        // Never pin a panel taller than the viewport: its measurements must stay reachable.
        const fits = root.scrollHeight <= window.innerHeight;
        animation = gsap.to(position, {
          progress: 1,
          ease: "none",
          onUpdate: () => publish(position.progress),
          scrollTrigger: {
            id: "homepage-route-comparison",
            trigger: root,
            start: fits ? trigger.start : "top center",
            end: fits
              ? () => `+=${window.innerHeight * (mobile ? trigger.scrollDistanceVh.mobile : trigger.scrollDistanceVh.desktop) / 100}`
              : "bottom center",
            scrub: trigger.scrub,
            pin: fits && trigger.pin,
            pinSpacing: trigger.pinSpacing,
            anticipatePin: trigger.anticipatePin,
            invalidateOnRefresh: true,
            markers: process.env.NODE_ENV === "development" && debug.markers,
            onRefresh: (self) => publish(self.progress),
          },
        });
        publish(animation?.scrollTrigger?.progress ?? 0);
      });
      rebuild();
      const resize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          rebuild();
          ScrollTrigger.refresh();
        }, 150);
      };
      window.addEventListener("resize", resize);
      return () => {
        clearTimeout(resizeTimer);
        window.removeEventListener("resize", resize);
      };
    }, root);

    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    window.addEventListener("one-access:intro-complete", refresh);
    refresh();
    return () => {
      window.removeEventListener("one-access:intro-complete", refresh);
      cancelAnimationFrame(frame);
      media.revert();
      section?.style.removeProperty("--example-progress");
    };
  }, []);

  return { rootRef, progress };
}
