import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  InventoryId: number;

  @Column()
  InventoryName: string;

  @Column()
  InventoryCreatedOn: Date;

  @Column()
  InventoryOwnerUserId: number;
}
