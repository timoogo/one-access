import type { ProfileId } from "@/domain/profile/profile-id";
export interface Profile {
    readonly id: ProfileId  ;
    readonly label: string;
}