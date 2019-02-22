import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany
} from "typeorm";
import { Category } from "./categoryModel";
import { Inventory } from "./inventoryModel";
import { Stock } from "./stockModel";

@Entity()
export class Thing {
  @Column({
    primary: true,
    unique: false
  })
  number: number;

  @Column()
  name: string;

  @ManyToOne(() => Inventory, inventory => inventory.things, {
    primary: true
  })
  inventory: Inventory;

  @ManyToMany(() => Category, category => category.things)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Stock, stock => stock.thing)
  stocks: Stock[];
}
