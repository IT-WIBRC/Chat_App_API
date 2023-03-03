import { Optional } from "sequelize";

export interface ImageDTO {
    imageId: string;
    title?: string;
    src: string;
    description?: string;
    createdAt?: string,
}

export interface ImageCreation extends Optional<ImageDTO, "imageId">{};