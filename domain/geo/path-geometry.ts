import type { SpatialPosition } from "@/domain/geo/spatial-position";

export interface PathGeometry {
    readonly points: readonly SpatialPosition[];
  }