import { Category } from "../category/category";
import { Stock } from "../stock/stock";

export class Thing {
  id: number;
  name: string;
  categories: Category[];
}
