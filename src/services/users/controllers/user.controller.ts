export default class UserController {
    private user: string;

    constructor(newUser: string) {
        this.user = newUser;
    }

    async create(): Promise<string> {
        return await this.user;
    }
}