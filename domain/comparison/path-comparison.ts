import type { AuditId } from "@/domain/audit/audit-id";
import type { PathMeasurement } from "@/domain/measurement/path-measurement";
import type { PathId } from "@/domain/path/path-id";

export interface ComparedPath {
  readonly auditId: AuditId;
  readonly pathId: PathId;
  readonly measurement: PathMeasurement;
}

export interface PathComparison {
  readonly reference: ComparedPath;
  readonly compared: ComparedPath;
}
