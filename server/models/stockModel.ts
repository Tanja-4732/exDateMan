import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Stock {
  @PrimaryColumn()
  number: number;


}
