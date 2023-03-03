import { Optional } from "sequelize";

export interface MemberDTO {
  memberId: string;
  userId: string;
  conversationId: string;
  join_at: Date;
  leave_at: Date;
}
export type MemberCreationDTO = Optional<MemberDTO, "memberId">;
