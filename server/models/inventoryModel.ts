import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn
} from "typeorm";
import { InventoryUser } from "./inventoryUserModel";
import { Thing } from "./thingModel";

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
    cascade: ["insert", "update"]
  })
  inventoryUsers: InventoryUser[];

  @OneToMany(type => Thing, thing => thing.Inventory, {
    cascade: ["insert", "update"]
  })
  Things: Thing[];
}
