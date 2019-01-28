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
  UserId: number;

  @Column()
  UserName: string;

  @Column()
  Email: string;

  @Column()
  SaltedPwdHash: string;

  @Column("date", {nullable: false, default: null })
  // @CreateDateColumn()
  UserCreatedOn: Date;

  @OneToMany(type => InventoryUser, inventoryUser => inventoryUser.user)
  inventoryUsers: InventoryUser[];
}
