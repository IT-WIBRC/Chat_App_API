import { Optional } from "sequelize";

export interface MemberDTO {
    memberId: string;
    userId: string;
    conversationId: string;
    join_at: Date;
    leave_at: Date;
}
export interface MemberCreationDTO extends Optional<MemberDTO, "memberId"> {};