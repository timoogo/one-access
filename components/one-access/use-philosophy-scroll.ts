"use client";
import { useEffect, useRef } from "react";
import { createWorldTimeline, type CanvasController } from "@/lib/philosophy-world/timeline";

export function usePhilosophyScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let controller: CanvasController | undefined;
    let resizeFrame = 0;
    let oldWidth = 0;
    let oldHeight = 0;
    const rebuild = () => {
      // Preserve the document's scroll range while replacing the pin. Without
      // this reservation, a forced layout clamps deep scroll positions to the
      // temporarily short page. No scroll command or timeline seek is needed.
      if (controller && !media.matches) root.style.minHeight = `${root.getBoundingClientRect().height}px`;
      controller?.destroy();
      controller = undefined;
      root.dataset.mode = media.matches ? "static" : "animated";
      if (media.matches) { root.style.minHeight = ""; return; }
      root.style.setProperty("--philosophy-top", `${Math.max(0, root.getBoundingClientRect().top + window.scrollY)}px`);
      oldWidth = stage.clientWidth;
      oldHeight = stage.clientHeight;
      controller = createWorldTimeline(stage, { width: oldWidth, height: oldHeight });
      controller.trigger.refresh();
      root.style.minHeight = "";
    };
    const resize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (!media.matches && (oldWidth !== stage.clientWidth || oldHeight !== stage.clientHeight)) rebuild();
      });
    };
    rebuild();
    media.addEventListener("change", rebuild);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(resizeFrame);
      media.removeEventListener("change", rebuild);
      window.removeEventListener("resize", resize);
      controller?.destroy();
    };
  }, []);
  return { rootRef, stageRef };
}
