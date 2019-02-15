import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from "typeorm";
import { Thing } from "./thingModel";
import { Inventory } from "./inventoryModel";

@Entity()
export class Stock {
  @PrimaryColumn()
  number: number;

  // TODO implement using objects and composite foreign keys
  // @ManyToOne(() => Thing, thing => thing.stocks, { primary: true })
  // @JoinColumn([
  //   {
  //     name: "thingNo",
  //     referencedColumnName: "ThingNo"
  //   },
  //   {
  //     name: "inventoryId",
  //     referencedColumnName: "ThingInventory"
  //   }
  // ])
  // thing: Thing;
  @PrimaryColumn()
  thingNo: number;

  @PrimaryColumn()
  inventoryId: number;

  @Column("date")
  exDate: Date;

  @Column()
  quantity: string;

  @Column()
  useUpIn: number;

  @Column({ default: 100.0 })
  percentLeft: number;
}
