import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
  ManyToMany
} from "typeorm";
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
    // eager: true
  })
  parentCategory: Category;

  // Some categories have children (else: empty)
  @OneToMany(type => Category, children => children.parentCategory, {
    // onDelete: "CASCADE"
    // cascade: true
  })
  childCategories: Category[];

  // Some categories have things which are tagged by them
  @ManyToMany(type => Thing, things => things.Categories)
  things: Thing[];
}
