import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn
} from "typeorm";
import { Category } from "./categoryModel";
import { Inventory } from "./inventoryModel";
import { Stock } from "./stockModel";

@Entity()
export class Thing {
  @Column({
    primary: true,
    unique: false
  })
  number: number;

  @Column()
  name: string;

  // @Column("integer")
  @ManyToOne(() => Inventory, inventory => inventory.things, {
    primary: true
  })
  @JoinColumn({
    name: "inventoryId",
    referencedColumnName: "id"
  })
  inventory: Inventory;

  @ManyToMany(() => Category, category => category.things)
  @JoinTable()
  categories: Category[];

  @Column({ nullable: true })
  /**
   * The barcode of the thing
   */
  code: string;

  // TODO fix this #3
  @OneToMany(() => Stock, stock => stock.thing)
  stocks: Stock[];
}
