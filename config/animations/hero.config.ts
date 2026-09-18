export const heroAnimationConfig = {
  timeScale: 1,
  timing: {
    structure: 0.42,
    image: 0.82,
    headline: 0.72,
    support: 0.42,
    actions: 0.38,
    footnote: 0.34,
  },
  offsets: {
    headline: "0.8em",
    support: 16,
    actions: 14,
    footnote: 12,
  },
  stagger: 0.08,
  easing: {
    structure: "power2.out",
    image: "power2.inOut",
    headline: "power3.out",
    support: "power2.out",
  },
  image: {
    initialClip: "inset(0 100% 0 0)",
    finalClip: "inset(0 0% 0 0)",
  },
} as const;
