import { Thing } from "../thing/thing";
import { Category } from "../category/category";
import { InventoryUser } from "../inventory-user/inventory-user";

export class Inventory {
  id: number;
  name: string;
  createdOn: Date;
  inventoryUsers?: InventoryUser[]; // TODO maybe remove
  categories?: Category[]; // TODO maybe remove
}
