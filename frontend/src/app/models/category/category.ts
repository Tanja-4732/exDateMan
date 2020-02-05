export class Category {
  /**
   * The name of the category
   */
  name: string;

  /**
   * The UUID of the category
   */
  uuid: string;

  /**
   * The UUID of the category's parent category (if any)
   */
  parentUuid?: string;

  /**
   * The date of the creation of the category
   */
  createdOn: Date;

  /**
   * The children of the category (if any; not to be stored directly)
   */
  children?: Category[];
}
