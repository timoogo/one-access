import type { Brand } from "@/domain/primitives/brand";

export type EntityId<Name extends string> = Brand<string, `${Name}Id`>;