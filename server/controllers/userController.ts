import { EntityManager, getManager } from "typeorm";
import { User } from "server/models/userModel";

export default class UserController {
  public async findUserForEmail(email: string): Promise<User> {
    const entityManager: EntityManager = getManager();
    const user: User = await entityManager.findOne(User, email);
    return user;
  }
}
