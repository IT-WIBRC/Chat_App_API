import { Optional } from "sequelize";
import { ROLE } from "./user";

export interface MemberDTO {
  memberId: string;
  userId: string;
  role: ROLE;
  conversationId: string;
  join_at: Date;
  leave_at: Date;
}
export type MemberCreationDTO = Optional<MemberDTO, "memberId">;
