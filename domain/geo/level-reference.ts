import type { Exclusive } from "@/domain/primitives/exclusive";

export type LevelReference = Exclusive<
  { readonly levelNumber: number },
  { readonly levelLabel: string }
>;