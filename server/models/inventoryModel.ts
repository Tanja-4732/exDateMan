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
    this.InventoryName = InventoryName;
    this.InventoryCreatedOn = new Date();
  }

  @PrimaryGeneratedColumn()
  InventoryId: number;

  @Column("text")
  InventoryName: string;

  @Column("date")
  // @CreateDateColumn()
  InventoryCreatedOn: Date;

  @OneToMany(type => InventoryUser, inventoryUser => inventoryUser.inventory, {
    cascade: true, onDelete: "CASCADE"
  })
  inventoryUsers: InventoryUser[];

  @OneToMany(type => Thing, thing => thing.Inventory, {
    cascade: true, onDelete: "CASCADE"
  })
  Things: Thing[];

  @OneToMany(type => Category, category => category.Inventory, {
    onDelete: "CASCADE"
  })
  categories: Category[];
}
