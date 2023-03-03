import { Optional } from "sequelize";
import { ImageDTO } from "../image/image.model";

export interface MessageDTO {
  messageId: string;
  text?: string;
  link?: string;
  image?: ImageDTO;
  createdAt?: string;
  updatedAt?: string;
}
export type MessageCreationDTO = Optional<MessageDTO, "messageId">;
