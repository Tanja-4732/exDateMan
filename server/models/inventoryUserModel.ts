import { Entity, PrimaryColumn, ManyToOne } from "typeorm";
import { Inventory } from "./inventoryModel";
import { User } from "./userModel";

export enum InventoryUserAccessRightsEnum {
  OWNER = "owner",
  ADMIN = "admin",
  WRITE = "write",
  READ = "read"
}

@Entity()
export class InventoryUser {
  @PrimaryColumn({
    type: "enum",
    enum: InventoryUserAccessRightsEnum
  })
  InventoryUserAccessRights: InventoryUserAccessRightsEnum;

  @ManyToOne(type => Inventory, inventory => inventory.inventoryUsers)
  inventory: Inventory;

  @ManyToOne(type => User, user => user.inventoryUsers)
  user: User;
}
