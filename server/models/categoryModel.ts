import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToOne
} from "typeorm";
import { InventoryUser } from "./inventoryUserModel";
import { Thing } from "./thingModel";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  CategoryId: number;

  @Column()
  CategoryName: string;

  @Column()
  ThingName: string;

  @ManyToOne(type => Thing, thing => thing.Categories)
  Things: Thing[];
}
