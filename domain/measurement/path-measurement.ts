import type { Meters } from "@/domain/primitives/distance";
import type { Seconds } from "@/domain/primitives/duration";

export interface PathMeasurement {
  readonly distance: Meters;
  readonly duration: Seconds;
  readonly effort: number;
  readonly complexity: number;
  readonly autonomy: number;
}
