import { User } from "./authentication";
import db from "./db";
import { inspect } from "util";
import { log, error } from "console";

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
  public static readonly authorizationEventStreamUuid =
    "0e723dd0-8015-4ed7-9308-30a51955f049";

  /**
   * The uuid of the authentication event stream
   * Contains all records of users (email, saltedPasswordHash, TOTP secret)
   */
  public static readonly authenticationEventStreamUuid =
    "092c1655-46dc-4722-b41f-2b038a1ecae5";

  /**
   * The parsed authentication events
   */
  private static authenticationEvents: AuthenticationEvent[];

  /**
   * The current state of users (projection from authenticationEventStream)
   */
  private static _users: User[];

  /**
   * The current state of users (projection from authenticationEventStream)
   */
  public get users(): User[] {
    return ServerEvents._users;
  }

  constructor() {
    if (ServerEvents._users == null) {
      this.fetchAuthenticationStream();
    }
  }

  /**
   * Obtains the authentication event stream from the db and parses it
   */
  private async fetchAuthenticationStream(): Promise<void> {
    try {
      // Get the events from the db
      ServerEvents.authenticationEvents = (await (await db()).query(
        `
        SELECT date, data
          FROM ${process.env.EDM_DB_SCHEMA}.events
        WHERE stream_id = $1
        ORDER BY date ASC;
        `,
        [ServerEvents.authenticationEventStreamUuid],
      )).rows;

      // Initialize the array
      ServerEvents._users = [];

      // Iterate over all events
      for (const event of ServerEvents.authenticationEvents) {
        ServerEvents.updateUsersProjection(event);
      }
    } catch (err) {
      error("Couldn't fetch authentication stream:");
      error(err);
    }
  }

  /**
   * Inserts an event into the db, appends it to the cached event log and
   * updates the current state (projection).
   *
   * @param event The event to be appended
   */
  public static async appendAuthenticationEvent(
    event: AuthenticationEvent,
  ): Promise<void> {
    try {
      // Insert the event into the db
      const result = await (await db()).query(
        `
        INSERT INTO ${process.env.EDM_DB_SCHEMA}.events
         (stream_id, date, data)
        VALUES ($1, $2, $3)
        `,
        [ServerEvents.authenticationEventStreamUuid, event.date, event.data],
      );

      // Append to the cached event log
      ServerEvents.authenticationEvents.push(event);

      // Update users projection
      ServerEvents.updateUsersProjection(event);
    } catch (err) {
      error("Couldn't append event:");
      error(err);
    }
  }

  /**
   * Updates the projection, one event at a time
   *
   * @param event The event to be used to update the projection with
   */
  private static updateUsersProjection(event: AuthenticationEvent) {
    const index = ServerEvents._users.findIndex(
      (user: User) => user.uuid === event.data.userUuid,
    );

    switch (event.data.crudType) {
      case crudType.CREATE:
        ServerEvents._users.push({
          uuid: event.data.userUuid,
          email: event.data.email,
          saltedPwdHash: event.data.saltedPwdHash,
          totpSecret: event.data.totpSecret,
          name: event.data.name,
        });
        break;

      case crudType.UPDATE:
        // Make temporary object
        var temp = {
          email: event.data.email,
          name: event.data.name,
          saltedPwdHash: event.data.saltedPwdHash,
          totpSecret: event.data.totpSecret,
        } as User;

        // Delete all null values
        Object.keys(temp).forEach(key => temp[key] == null && delete temp[key]);

        // Assign the changed values
        Object.assign(this._users[index], temp);
        break;

      case crudType.DELETE:
        this._users.splice(index, 1);
        break;
    }
  }
}

export interface AuthenticationEvent {
  /**,
   * The date of the event
   */
  date: Date;

  /**
   * The data of the event
   */
  data: {
    /**
     * The uid of the user this event is about
     */
    userUuid: string;

    /**
     * Defines what type of operation was performed
     */
    crudType: crudType;

    /**
     * The email address of the user used to log in
     */
    email?: string;

    /**
     * The date of the creation of this user
     *
     * This field may only be set in a user-created event
     */
    createdOn?: Date;

    /**
     * The salted password hash used to log in
     */
    saltedPwdHash?: string;

    /**
     * The secret used to generate the TOTP required to log in when using 2FA
     */
    totpSecret?: string | null;

    /**
     * A friendly name of the user
     */
    name?: string;
  };
}

/**
 * Used to describe which type of operation was performed
 *
 * (read is excluded from this list since it doesn't affect the data)
 */
export enum crudType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}
