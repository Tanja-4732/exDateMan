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
  inventory: Inventory;

  // Every category has a name
  @Column()
  name: string;

  // Some categories have a parent (else: null)
  @ManyToOne(type => Category, parent => parent.children, {
    // nullable: true
    cascade: ["insert", "update"],
    // eager: true
  })
  parent: Category;

  // Some categories have children (else: empty)
  @OneToMany(type => Category, children => children.parent, {
    // onDelete: "CASCADE"
    // cascade: true
  })
  children: Category[];

  // Some categories have things which are tagged by them
  @ManyToMany(type => Thing, things => things.categories)
  things: Thing[];
}
