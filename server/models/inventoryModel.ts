import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { InventoryUser } from "./inventoryUserModel";

@Entity()
export class Inventory {

  constructor(InventoryId: number, InventoryName: string) {
    this.InventoryId = InventoryId;
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

  @OneToMany(type => InventoryUser, inventoryUser => inventoryUser.inventory)
  inventoryUsers: InventoryUser[];
}
