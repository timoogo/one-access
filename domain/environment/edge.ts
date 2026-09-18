import type { PathGeometry } from "@/domain/geo/path-geometry";
import type { NodeId } from "@/domain/environment/node-id";
import type { EdgeId } from "@/domain/environment/edge-id";
import type { EdgeDirection } from "@/domain/environment/edge-direction";

export interface Edge {
    readonly id: EdgeId;
    readonly source: NodeId;
    readonly direction: EdgeDirection;
    readonly target: NodeId;
    readonly geometry: PathGeometry;
}