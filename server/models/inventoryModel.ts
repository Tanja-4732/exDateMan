import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn
} from "typeorm";
import { InventoryUser } from "./inventoryUserModel";
import { Thing } from "./thingModel";
import { Category } from "./categoryModel";

@Entity()
export class Inventory {
  constructor(InventoryName: string) {
    this.name = InventoryName;
    this.createdOn = new Date();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("date")
  // @CreateDateColumn()
  createdOn: Date;

  @OneToMany(type => InventoryUser, inventoryUser => inventoryUser.inventory, {
    cascade: true, onDelete: "CASCADE"
  })
  inventoryUsers: InventoryUser[];

  @OneToMany(type => Thing, thing => thing.inventory, {
    cascade: true, onDelete: "CASCADE"
  })
  things: Thing[];

  @OneToMany(type => Category, category => category.inventory, {
    onDelete: "CASCADE"
  })
  categories: Category[];
}
