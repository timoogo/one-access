export const scrollAnimationConfig = {
  timeScale: 1,
  trigger: {
    start: "top 82%",
    end: "top 20%",
  },
  timing: {
    label: 0.42,
    heading: 0.7,
    copy: 0.42,
    cards: 0.55,
    cardStagger: 0.08,
    scaleAxis: 0.7,
    scaleMarkers: 0.42,
    process: 0.55,
    support: 0.65,
  },
  offsets: {
    heading: "0.65em",
    copy: 14,
    card: 12,
    process: 12,
  },
  easing: {
    structure: "power2.out",
    headline: "power3.out",
    reveal: "power2.out",
    route: "power2.inOut",
  },
  routeComparison: {
    trigger: {
      start: "top top",
      scrollDistanceVh: {
        desktop: 200,
        mobile: 230,
      },
      mobileBreakpoint: 700,
      scrub: 0.5,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    },
    timeline: {
      routesStart: 0.06,
      // Animation positions only; these are not scores, ratios, or measurements.
      referenceComplete: 0.42,
      adaptedComplete: 0.8,
      referenceMetricsStart: 0.46,
      adaptedMetricsStart: 0.83,
      conclusionStart: 0.88,
      finalHoldStart: 0.92,
      release: 1,
    },
    motion: {
      panelRevealDuration: 0.06,
      metricsDuration: 0.06,
      conclusionDuration: 0.06,
    },
    visual: {
      verticalOffsetPx: 0,
      gridOpacity: 0.35,
      headerSpacePx: {
        desktop: 80,
        mobile: 70,
      },
      comparatorMaxWidth: {
        desktop: 1120,
        mobile: 680,
      },
      desktopBleedPx: 16,
    },
    debug: {
      markers: false,
      logProgress: false,
      logIntervalMs: 160,
    },
  },
} as const;
