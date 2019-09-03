export interface Inventory {
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
   * The uuids of the writeables of this inventory
   */
  writeableUuids: string[];

  /**
   * The uuids of the readables of this inventory
   */
  readableUuids: string[];
}
