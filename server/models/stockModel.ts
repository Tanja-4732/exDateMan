import { Entity, PrimaryColumn, ManyToOne, Column } from "typeorm";
import { Thing } from "./thingModel";

@Entity()
export class Stock {
  @PrimaryColumn()
  number: number;

  @ManyToOne(() => Thing, thing => thing.stocks)
  thing: Thing;

  @Column("date")
  exDate: Date;

  @Column()
  quantity: string;

  @Column()
  useUpIn: number;

  @Column({ default: 100.0 })
  percentLeft: number;
}
