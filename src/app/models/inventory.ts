import { Thing } from "./thing";
import { Category } from "./category";
import { InventoryUser } from "./inventory-user";

export class Inventory {
  InventoryId: number;

  InventoryName: string;

  InventoryCreatedOn: Date;

  inventoryUsers?: InventoryUser[];

  Things?: Thing[];

  categories?: Category[];
}
