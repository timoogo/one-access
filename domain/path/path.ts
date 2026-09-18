import type { PathId } from "@/domain/path/path-id";
import type { NodeId } from "@/domain/environment/node-id";
import type { PathSegment } from "@/domain/path/path-segment";

export interface Path {
  readonly id: PathId;
  readonly origin: NodeId;
  readonly destination: NodeId;
  readonly segments: readonly PathSegment[];
}
