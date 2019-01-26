import { EntityManager, getManager } from "typeorm";
import { User } from "../models/userModel";
import { log } from "util";

export default class UserController {
  public async findUserForEmailOrFail(email: string): Promise<User> {
    const entityManager: EntityManager = getManager();
    const user: User = await entityManager.findOneOrFail(User, {
      where: {
        Email: email
      }
    });
    log("Found user " + user.UserName + " with the email of " + email); // TODO remove log statement
    return user;
  }
}
