import { Inventory } from "./inventory";
import { InventoryUserAccess } from "./inventory-user-access.enum";
import { User } from "./user";

export class InventoryUser {
  inventory: Inventory;

  user: User;

  InventoryUserAccessRights: InventoryUserAccess;
}
