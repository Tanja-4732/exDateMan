export class InventoryEvent {
  /**
   * The date (as an ISO string) at which the event occurred
   */
  date: string;

  /**
   * Data about the inventory
   */
  data: {
    /**
     * The ID of the object to be modified
     *
     * New categories have -1
     * New things have -2
     * New stocks have -3
     */
    targetId: number;
  };

  // TODO add the userId to the event
}
