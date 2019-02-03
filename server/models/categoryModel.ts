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
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Thing, thing => thing.Categories)
  Things: Thing[];

  @ManyToOne(type => Category, category => category.childCategories)
  parentCategory: Category;

  @OneToMany(type => Category, category => category.parentCategory)
  childCategories: Category[];
}
