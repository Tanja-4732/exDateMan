import { Inventory } from "../inventory/inventory";
import { InventoryUserAccess } from "../inventory-user-access.enum";
import { User } from "../user/user";

export class InventoryUser {
  inventory: Inventory;

  user: User;

  InventoryUserAccessRights: InventoryUserAccess;
}
