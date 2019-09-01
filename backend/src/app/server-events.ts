import { User } from "./authentication";
import db from "./db";

/**
 * Manages server-side events
 */
export class ServerEvents {
  static findUserByEmailOrFail(email: string): User | Promise<User> {
    throw new Error("Method not implemented.");
  }

  /**
   * The uuid of the authorization event stream
   * Contains all records of inventory-user permissions (owner, admins,
   * readAbles, writeAbles)
   */
  public readonly authorizationEventStreamUuid =
    "0e723dd0-8015-4ed7-9308-30a51955f049";

  /**
   * The uuid of the authentication event stream
   * Contains all records of users (email, saltedPasswordHash, TOTP secret)
   */
  public readonly authenticationEventStreamUuid =
    "092c1655-46dc-4722-b41f-2b038a1ecae5";

  constructor() {}

  /**
   * Obtains the authentication event stream from the db and parses it
   */
  private fetchAuthenticationStream(): void {}
}
