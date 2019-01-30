import { getManager, EntityManager } from "typeorm";
import { Inventory } from "../models/inventoryModel";
import { Request, Response, NextFunction, Router } from "express";
import { User } from "../models/userModel";
import { log } from "util";
import {
  InventoryUser,
  InventoryUserAccessRightsEnum
} from "../models/inventoryUserModel";

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
