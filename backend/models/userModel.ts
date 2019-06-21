import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from "typeorm";
import { InventoryUser } from "./inventoryUserModel";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique: true})
  email: string;

  @Column()
  saltedPwdHash: string;

  @Column("date")
  // @CreateDateColumn()
  createdOn: Date;

  @OneToMany(type => InventoryUser, inventoryUser => inventoryUser.user)
  inventoryUsers: InventoryUser[];
}
