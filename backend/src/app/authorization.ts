import { Router, Request, Response, NextFunction } from "express";
import { InventoryEvent, itemType } from "./client-events";
import { error, log } from "console";
import { crudType } from "./authentication";
import { ExdatemanApplication } from "./application";
import { inspect } from "util";

/**
 * Handles JWT checks and tests if a user is authorized to access a resource
 *
 * This class does not provide a router.
 */
export class Authorization {
  private static singletonFlag = false;

  /**
   * The Authorization routes
   */
  public routes: Router;

  /**
   * The current state of inventories (a projection from the event logs)
   */
  private static inventoriesProjection: { [uuid: string]: Inventory } = {};

  constructor() {
    // Enforce singleton
    if (Authorization.singletonFlag) {
      throw new Error("An Authorization instance already exists.");
    } else Authorization.singletonFlag = true;

    // Instantiate the router
    this.routes = Router();

    // Get the events of one inventory
    this.routes.get(
      "/accessibleInventoryUuids",
      (req: Request, res: Response) =>
        this.handleGetAllAccessibleInventoryUuids(req, res),
    );
  }

  /**
   * Handles API requests to get all inventoryUuids a user has access to
   */
  private async handleGetAllAccessibleInventoryUuids(
    req: Request,
    res: Response,
  ): Promise<any> {
    try {
      // Get the userUuid
      const userUuid = ExdatemanApplication.ae.verifyJWT(req.cookies.JWT).sub;

      // Initiate an empty array
      const accessibleInventoryUuids: string[] = [];

      // Iterate over all inventoryUuids
      for (const uuid of await ExdatemanApplication.ce.getAllInventoryUuids()) {
        // log("[Authorization (loop)] uuid:");
        // log(Authorization.inventoriesProjection);
        // log(uuid);

        // Check if the user has read access
        if (this.checkReadAccess(uuid.inventoryUuid, userUuid))
          // Append the uuid to the array
          accessibleInventoryUuids.push(uuid.inventoryUuid);
      }

      // Send the array back
      res.json(accessibleInventoryUuids);
      return;
    } catch (err) {
      res.sendStatus(400);
      error(err);
      return;
    }
  }

  /**
   * Obtains an inventory event log from ClientEvents and parses it
   *
   * @param inventoryEvents The events to be applied to the projection
   * @param inventoryUuid The uuid of the inventory of the events to be applied
   */
  public applyInventory(inventoryEvents: InventoryEvent[]) {
    // Iterate over the events in the log
    for (const event of inventoryEvents) {
      // Check if the event is about an inventory
      if (event.data.itemType === itemType.INVENTORY) {
        // Update the inventories projection according to the event
        this.updateInventoriesProjection(event);
      }
    }
  }

  /**
   * Prevents unauthorized users from making changes in inventories for which
   * they lack permission.
   *
   * This prevents malicious requests from changing the inventories of others by
   * specifying an inventoryUuid in an event which is not genuine.
   *
   * This method is meant to check newly received events meant by the user to be
   * appended to a event log. It shouldn't be used to check events while they
   * are being fetched from the db.
   *
   * This method only checks the fields which are required to uphold an
   * authorization-only policy, the event object may still be malformed.
   *
   * @param event The event to check
   * @param userUuid The uuid of the JWT sent along with the request
   *
   * @returns true, if the request is legit, false if otherwise
   */
  public checkEventLegitimacy(
    event: InventoryEvent,
    userUuid: string,
  ): boolean {
    try {
      // Check, if the event is missing authorization-specific fields
      if (
        event.inventoryUuid == null ||
        event.data.crudType == null ||
        event.data.itemType == null
      )
        return false;

      // Check if the event was issued by the user specified in the JWT
      if (event.data.userUuid !== userUuid) return false;

      // When creating a new inventory...
      if (
        event.data.crudType === crudType.CREATE &&
        event.data.itemType === itemType.INVENTORY
      )
        // ...check if this inventory uuid is already in use
        return Authorization.inventoriesProjection[event.inventoryUuid] == null;

      // When updating or deleting an inventory...
      if (event.data.itemType === itemType.INVENTORY)
        // ...check if owner or admin permissions are present
        return (
          Authorization.inventoriesProjection[event.inventoryUuid].ownerUuid ===
            userUuid ||
          Authorization.inventoriesProjection[
            event.inventoryUuid
          ].adminUuids.includes(userUuid)
        );

      // Every other operation requires the user to at least have the "writable"
      // permission for the inventory
      return (
        Authorization.inventoriesProjection[event.inventoryUuid].ownerUuid ===
          userUuid ||
        Authorization.inventoriesProjection[
          event.inventoryUuid
        ].adminUuids.includes(userUuid) ||
        Authorization.inventoriesProjection[
          event.inventoryUuid
        ].writableUuids.includes(userUuid)
      );
    } catch (err) {
      error("Couldn't check for legitimacy:");
      error(err);
      return false;
    }
  }

  /**
   * Updates the inventories projection, one event at a time
   *
   * @param event The event to be used to update the projection with
   */
  public updateInventoriesProjection(event: InventoryEvent): Inventory {
    // Make sure the event is about an inventory
    if (event.data.itemType !== itemType.INVENTORY)
      throw new Error(
        "Cannot update inventoriesProjection with non-inventory event.",
      );

    /**
     * The inventory to be created or updated (ignored for delete events)
     */
    const newInventory = {
      uuid: event.data.uuid,
      name: event.data.inventoryData.name,
      createdOn: event.data.inventoryData.createdOn,
      ownerUuid: event.data.inventoryData.ownerUuid,
      adminUuids: event.data.inventoryData.adminsUuids,
      writableUuids: event.data.inventoryData.WritablesUuids,
      readableUuids: event.data.inventoryData.readablesUuids,
    };

    // Find the right CRUD operation
    switch (event.data.crudType) {
      case crudType.CREATE:
        // Assign a new inventory to the dictionary
        Authorization.inventoriesProjection[event.inventoryUuid] = newInventory;

        // Return the new inventory
        return newInventory;

      case crudType.UPDATE:
        // Remove immutable values
        delete newInventory.uuid;
        delete newInventory.createdOn;

        // Delete all null values
        Object.keys(newInventory).forEach(
          key => newInventory[key] == null && delete newInventory[key],
        );

        // Assign the changed values
        Object.assign(
          Authorization.inventoriesProjection[event.inventoryUuid],
          newInventory,
        );

        // Return the updated inventory
        return Authorization.inventoriesProjection[event.inventoryUuid];

      case crudType.DELETE:
        // Delete the inventory
        delete Authorization.inventoriesProjection[event.inventoryUuid];

        // Return nothing (the inventory is gone)
        return null;
    }
  }

  /**
   * Prevents unauthorized users from reading from inventories for which they
   * lack permission.
   *
   * This method is meant to be used when a user wants to fetch events from an
   * inventory.
   *
   * @param inventoryUuid The uuid of the inventory to check against
   * @param userUuid The uuid of the user to check with
   *
   * @returns true, if the request is legit, false if otherwise
   */
  public checkReadAccess(inventoryUuid: string, userUuid: string): boolean {
    return (
      Authorization.inventoriesProjection[inventoryUuid].ownerUuid ===
        userUuid ||
      Authorization.inventoriesProjection[inventoryUuid].adminUuids.includes(
        userUuid,
      ) ||
      Authorization.inventoriesProjection[inventoryUuid].writableUuids.includes(
        userUuid,
      ) ||
      Authorization.inventoriesProjection[inventoryUuid].readableUuids.includes(
        userUuid,
      )
    );
  }
}

interface Inventory {
  /**
   * The uuid of this inventory
   *
   * This is also the uuid of its event log.
   */
  uuid: string;

  /**
   * The name of this inventory
   */
  name: string;

  /**
   * The date of the creation of this inventory
   */
  createdOn: Date;

  /**
   * The uuid of this inventories owner
   */
  ownerUuid: string;

  /**
   * The uuids of the admins of this inventory
   */
  adminUuids: string[];

  /**
   * The uuids of the Writables of this inventory
   */
  writableUuids: string[];

  /**
   * The uuids of the readables of this inventory
   */
  readableUuids: string[];
}
