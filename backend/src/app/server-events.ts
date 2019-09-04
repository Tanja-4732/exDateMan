import { User, Authentication, crudType } from "./authentication";
import db from "./db";
import { inspect } from "util";
import { log, error } from "console";

/**
 * Manages server-side events
 */
export class ServerEvents {
  private static singletonFlag = false;

  /**
   * The uuid of the authentication event stream
   * Contains all records of users (email, saltedPasswordHash, TOTP secret)
   */
  public static readonly userEventLogUuid =
    "092c1655-46dc-4722-b41f-2b038a1ecae5";

  /**
   * The parsed authentication events
   */
  private static userEvents: UserEvent[];

  constructor() {
    // Enforce singleton
    if (ServerEvents.singletonFlag) {
      throw new Error("An ServerEvents instance already exists.");
    } else ServerEvents.singletonFlag = true;

    this.fetchUserEventLog();
  }

  /**
   * Obtains the authentication event log from the db and parses it
   */
  private async fetchUserEventLog(): Promise<void> {
    try {
      // Get the events from the db
      ServerEvents.userEvents = (await (await db()).query(
        `
        SELECT date, data
          FROM ${process.env.EDM_DB_SCHEMA}.events
        WHERE stream_id = $1
        ORDER BY date ASC;
        `,
        [ServerEvents.userEventLogUuid],
      )).rows;

      // Iterate over all events
      for (const event of ServerEvents.userEvents) {
        Authentication.updateUsersProjection(event);
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
    event: UserEvent,
  ): Promise<void> {
    try {
      // Insert the event into the db
      const result = await (await db()).query(
        `
        INSERT INTO ${process.env.EDM_DB_SCHEMA}.events
         (stream_id, date, data)
        VALUES ($1, $2, $3)
        `,
        [ServerEvents.userEventLogUuid, event.date, event.data],
      );

      // Append to the cached event log
      ServerEvents.userEvents.push(event);

      // Update users projection
      Authentication.updateUsersProjection(event);
    } catch (err) {
      error("Couldn't append event:");
      error(err);
    }
  }
}

export interface UserEvent {
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
