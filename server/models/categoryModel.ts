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

  // Every category belongs to one inventory
  @ManyToOne(type => Inventory, inventory => inventory.categories, {
    primary: true
  })
  Inventory: Inventory;

  // Every category has a name
  @Column()
  name: string;

  // Some categories have a parent (else: null)
  @ManyToOne(type => Category, parent => parent.childCategories, {
    // nullable: true
    cascade: ["insert", "update"],
    eager: true
  })
  parentCategory: Category;

  // Some categories have children (else: empty)
  @OneToMany(type => Category, children => children.parentCategory, {
    // onDelete: "CASCADE"
    cascade: true
  })
  childCategories: Category[];

  /*   @ManyToOne(type => Category, category => category.oneManyCategories, {
    cascade: true
  })
  oneManyCategory: Category;

  @OneToMany(type => Category, category => category.oneManyCategory, {
    cascade: true
  })
  oneManyCategories: Category[] = [];
 */
  // Some categories have things which are tagged by them
  @OneToMany(type => Thing, things => things.Categories)
  things: Thing[];
}
