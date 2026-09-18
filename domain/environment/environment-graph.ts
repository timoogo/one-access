import type { Edge } from "@/domain/environment/edge";
import type { Node } from "@/domain/environment/node";
import type { EnvironmentId } from "@/domain/environment/environment-id";

export interface EnvironmentGraph {
    readonly id: EnvironmentId;
    readonly nodes: readonly Node[];
    readonly edges: readonly Edge[];
}