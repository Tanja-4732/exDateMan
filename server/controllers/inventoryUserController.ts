// TODO delete old class when ready
/*
import { getManager, EntityManager } from "typeorm";
import { Inventory } from "../models/inventoryModel";
import { User } from "../models/userModel";
import { log } from "util";
import { InventoryUser } from "../models/inventoryUserModel";

export default class InventoryUserController {
   public static async getInventoryUserOrFail(
    user: User,
    inventory: Inventory
  ): Promise<InventoryUser> {
    const entityManager: EntityManager = getManager();
    return await entityManager.findOneOrFail(InventoryUser, {
      where: {
        user: user,
        inventory: inventory
      }
    });
  }
}
*/
