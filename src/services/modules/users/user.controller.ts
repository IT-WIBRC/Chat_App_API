import { Request, Response } from "express";
import { UserDTO } from "./User.model";
import UserService from "./user.service";

export default class UserController {
    private user: UserService;

    constructor() {
        this.user = new UserService();
        
    }

    async create(req: Request, res: Response): Promise<Response<UserDTO[]>> {
        const users = await this.user.findAll();
        return res.status(200).json(users);
    }

    async findAll(req: Request, res: Response): Promise<Response<UserDTO[]>> {
        const users = await new UserService().findAll();
        return res.status(200).json(users);
    }
}