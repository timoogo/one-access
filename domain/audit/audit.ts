import type { AuditId } from "@/domain/audit/audit-id";
import type { EnvironmentId } from "@/domain/environment/environment-id";
import type { PathId } from "@/domain/path/path-id";
import type { ProfileId } from "@/domain/profile/profile-id";
import type { PathAssessment } from "@/domain/audit/path-assessment";

export interface Audit {
  readonly id: AuditId;
  readonly environmentId: EnvironmentId;
  readonly profileId: ProfileId;
  readonly assessments: readonly PathAssessment[];
  readonly preferredPathId?: PathId;
}
