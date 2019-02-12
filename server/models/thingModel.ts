import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne
} from "typeorm";
import { InventoryUser } from "./inventoryUserModel";
import { Category } from "./categoryModel";
import { Inventory } from "./inventoryModel";

@Entity()
export class Thing {
  @Column({
    primary: true,
    unique: false
  })
  ThingNo: number;

  @Column()
  ThingName: string;

  @ManyToOne(type => Inventory, inventory => inventory.Things, {
    primary: true
  })
  Inventory: Inventory;

  @OneToMany(type => Category, category => category.things)
  Categories: Category[];
}
