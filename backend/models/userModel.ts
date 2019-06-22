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

  @Column({ unique: true })
  email: string;

  @Column()
  saltedPwdHash: string;

  @Column("date")
  // @CreateDateColumn()
  createdOn: Date;

  @OneToMany(type => InventoryUser, inventoryUser => inventoryUser.user)
  inventoryUsers: InventoryUser[];

  /**
   * Whether or not to enable 2FA
   *
   * @type {boolean}
   * @memberof User
   */
  @Column({ default: false })
  tfaEnabled: boolean;

  /**
   * The secret used to generate 2FA OTPs
   *
   * @type {string}
   * @memberof User
   */
  @Column({ nullable: true })
  tfaSecret: string;

  /**
   * The URL used to add a 2FA OTP to such an app
   *
   * @type {string}
   * @memberof User
   */
  @Column({ nullable: true })
  tfaUrl: string;
}
