import { Optional } from "sequelize";
import { UserDTO } from "..";

export interface ConversationDTO {
    conversationId: string;
    name: string;
    description?: string;
    users: UserDTO[];
    createdAt?: string;
}
export type ConversationCreationDTO = Optional<ConversationDTO, "conversationId">