import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToOne,
  PrimaryColumn
} from "typeorm";
import { InventoryUser } from "./inventoryUserModel";
import { Thing } from "./thingModel";
import { Inventory } from "./inventoryModel";

@Entity()
export class Category {

  @PrimaryColumn()
  number: number;

  @ManyToOne(type => Inventory, inventory => inventory.categories, {
    primary: true
  })
  Inventory: Inventory;

  @Column()
  name: string;

  @ManyToOne(type => Category, category => category.childCategories, {
    nullable: true,
  })
  parentCategory: Category;

  @OneToMany(type => Category, category => category.parentCategory, {
    cascade: ["remove"]
  })
  childCategories: Category[];

  @OneToMany(type => Thing, thing => thing.Categories)
  things: Thing[];
}
