import type { ElevationMeters } from "@/domain/primitives/elevation";

export interface GeoPoint {
    readonly latitude: number;
    readonly longitude: number;
    readonly elevation?: ElevationMeters;
}
