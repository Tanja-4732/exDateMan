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
  @PrimaryGeneratedColumn()
  ThingId: number;

  @Column()
  ThingNo: number;

  @Column()
  ThingName: string;

  @ManyToOne(type => Inventory, inventory => inventory.Things)
  Inventory: InventoryUser[];

  @OneToMany(type => Category, category => category.Things)
  Categories: Category[];
}
