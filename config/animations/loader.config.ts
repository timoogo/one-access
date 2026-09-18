export const loaderAnimationConfig = {
  development: {
    // This flag only applies when NODE_ENV is development.
    alwaysReplay: true,
  },
  timing: {
    timeScale: 1,
    initialHold: 0.3,
    contraction: 1.35,
    finalDashHold: 0.25,
    morph: 0.45,
    convergence: 0.3,
    logoHold: 0.6,
    exit: 0.25,
  },
  easing: {
    contraction: "power2.inOut",
    morph: "power1.inOut",
    convergence: "power2.out",
    exit: "power2.out",
  },
  layout: {
    desktop: { initialSeparation: 500 },
    mobile: { initialSeparation: 96 },
    finalDashSeparation: 42,
    finalSeparation: 64,
    finalInlineMargin: 5,
  },
  axis: {
    segmentCount: 11,
    contractionScale: 0.08,
    fadeDurationRatio: 0.76,
  },
  separator: {
    initialBarWidth: 12,
    initialBarHeight: 2,
    initialBarOffset: 6,
    finalDotSize: 7,
    finalDotGap: 16, // vertical gap
    morphRotation: 90,
  },
  exitTransition: {
    duration: 0.65,
    revealDuration: 0.65,
    revealEase: "power2.inOut",
    ease: "power2.inOut",
    metadataExitDuration: 0.14,
  },
} as const;
