import type { GeoPoint } from "@/domain/geo/geo-point";
import type { LevelReference } from "@/domain/geo/level-reference";

export type SpatialPosition = {
  readonly geoPoint: GeoPoint;
} & Partial<LevelReference>;