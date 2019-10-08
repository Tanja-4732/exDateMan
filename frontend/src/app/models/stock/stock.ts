export interface Stock {
  /**
   * The UUID of this Stock
   */
  uuid: string;

  /**
   * The date of expiration of this Stock
   */
  exDate: Date;

  /**
   * The quantity of this Stock
   */
  quantity: string;

  /**
   * The number of days this Stock must be used up in after it has been opened
   */
  useUpIn: number;

  /**
   * The percentage of how much of the Stock is left
   */
  percentLeft: number;

  /**
   * The date this Stock was added on
   */
  addedOn: Date;

  /**
   * The date this Stock was opened on for the first time
   */
  openedOn?: Date;
}
