import type { EdgeId } from "@/domain/environment/edge-id";
import type { NodeId } from "@/domain/environment/node-id";

export interface PathSegment {
    readonly edgeId: EdgeId;
    readonly from: NodeId;
    readonly to: NodeId;
}