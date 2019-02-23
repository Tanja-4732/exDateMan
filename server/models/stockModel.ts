import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from "typeorm";
import { Thing } from "./thingModel";
import { Inventory } from "./inventoryModel";

@Entity()
export class Stock {
  @PrimaryColumn()
  number: number;

  @ManyToOne(type => Inventory, { primary: true })
  inventory: Inventory;

  // @ManyToOne(type => Thing, { primary: true }) // this was my first attempt
  // thing: Thing;

  // TODO implement using objects and composite foreign keys #3
  // @ManyToOne(() => Thing, thing => thing.stocks, { primary: true })
  // @JoinColumn([
  //   {
  //     name: "inventory",
  //     referencedColumnName: "inventory"
  //   },
  //   {
  //     name: "thingNumber",
  //     referencedColumnName: "number"
  //   }
  // ])
  // thing: Thing;

  // TODO remove ugly workaround when ready (needs re-implementation) #3
  @Column({primary: true})
  thingNumber: number; // very ugly indeed

  @Column("date")
  exDate: Date;

  @Column()
  quantity: string;

  @Column()
  useUpIn: number;

  @Column({ default: 100.0 })
  percentLeft: number;
}
