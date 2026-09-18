import type { PathId } from "@/domain/path/path-id";

export interface PathAssessment {
  readonly pathId: PathId;
  readonly usable: boolean;
}
