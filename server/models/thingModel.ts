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
  ThingNo: number;

  @Column()
  ThingName: string;

  @ManyToOne(() => Inventory, inventory => inventory.Things, {
    primary: true
  })
  Inventory: Inventory;

  @ManyToMany(() => Category, category => category.things)
  @JoinTable()
  Categories: Category[];

  @OneToMany(() => Stock, stock => stock.thing)
  stocks: Stock[];
}
