import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToOne
} from "typeorm";
import { InventoryUser } from "./inventoryUserModel";
import { Thing } from "./thingModel";
import { Inventory } from "./inventoryModel";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: false})
  number: number;

  @Column()
  name: string;

  @ManyToOne(type => Inventory, inventory => inventory.categories)
  Inventory: Inventory;

  @OneToMany(type => Thing, thing => thing.Categories)
  Things: Thing[];

  @ManyToOne(type => Category, category => category.childCategories)
  parentCategory: Category;

  @OneToMany(type => Category, category => category.parentCategory)
  childCategories: Category[];
}
