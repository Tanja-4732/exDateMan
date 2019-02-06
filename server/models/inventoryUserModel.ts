import { Entity, PrimaryColumn, ManyToOne, Column } from "typeorm";
import { Inventory } from "./inventoryModel";
import { User } from "./userModel";

export enum InventoryUserAccessRightsEnum {
  OWNER = "owner",
  ADMIN = "admin",
  WRITE = "write",
  READ = "read"
}

/**
 * Compare two accessRights to see if it its privilege is sufficient
 *
 * @returns -1, if the privileges sufficient, 0 if they are, 1 if they exceed the target
 */
export function compareInventoryUserAccessRights(
  compare: InventoryUserAccessRightsEnum,
  against: InventoryUserAccessRightsEnum
): number {
  // Check if equal
  if (compare === against) {
    return 0;
  }

  // If not identical
  switch (compare) {
    // When I'm owner
    case InventoryUserAccessRightsEnum.OWNER:
      return 1;
    // When I'm admin
    case InventoryUserAccessRightsEnum.ADMIN:
      if (against === InventoryUserAccessRightsEnum.OWNER) {
        return -1;
      } else {
        return 1;
      }
    // When I've got write access
    case InventoryUserAccessRightsEnum.WRITE:
      if (against === InventoryUserAccessRightsEnum.READ) {
        return 1;
      } else {
        return -1;
      }
  }

  // This should be unreachable
  throw new Error(
    "Cannot compare invalid values." + "Must use InventoryUserAccessRightsEnum."
  );
}

@Entity()
export class InventoryUser {
  constructor(
    inventory: Inventory,
    user: User,
    accessRights: InventoryUserAccessRightsEnum
  ) {
    this.inventory = inventory;
    this.user = user;
    this.InventoryUserAccessRights = accessRights;
  }

  @ManyToOne(type => Inventory, inventory => inventory.inventoryUsers, {
    primary: true,
    cascade: ["insert", "update"]
  })
  inventory: Inventory;

  @ManyToOne(type => User, user => user.inventoryUsers, {
    primary: true,
    cascade: ["insert", "update"]
  })
  user: User;

  @Column({
    type: "enum",
    enum: InventoryUserAccessRightsEnum,
    nullable: false
  })
  InventoryUserAccessRights: InventoryUserAccessRightsEnum;
}
