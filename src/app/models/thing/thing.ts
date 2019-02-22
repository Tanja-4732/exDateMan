import { Inventory } from "../inventory/inventory";
import { Category } from "../category/category";
import { Stock } from "../stock/stock";

export class Thing {
  number: number;
  name: string;
  inventory?: Inventory; // TODO maybe remove; server doesn't send this
  categories: Category[];
  stocks?: Stock[];
}
