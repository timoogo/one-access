import type { SpatialPosition } from "@/domain/geo/spatial-position";
import type { NodeId } from "@/domain/environment/node-id";

export interface Node {
    readonly id: NodeId;
    readonly position: SpatialPosition;
}