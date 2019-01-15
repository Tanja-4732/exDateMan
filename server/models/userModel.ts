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
  UserEmail: string;

  @Column()
  UserPwdSaltedHash: string;

  @Column()
  UserPwdHashSalt: string;

  @Column("date")
  // @CreateDateColumn()
  UserCreatedOn: Date;

  @OneToMany(type => InventoryUser, inventoryUser => inventoryUser.user)
  inventoryUsers: InventoryUser[];
}
