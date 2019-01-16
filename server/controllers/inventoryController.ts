import { getManager } from "typeorm";
import { Inventory } from "server/models/inventoryModel";
import { Request, Response, NextFunction, Router } from "express";

const inventory: Inventory = new Inventory();


export default class InventoryController {

  /**
   * Handles queries about general inventory information.
   *
   * @export
   * @param {Request} req The request object
   * @param {Response} res The Response object
 * @param {NextFunction} next The next function
 */
public getInventoryDetails(req: Request, res: Response, next: NextFunction): void {
  if (existsInDB(req.params.inventoryId)) { // TODO implement
    res.status(200).json({
      owner: {
        userId: "userId",
        name: "name",
        userEmail: "email"
      },
      readPermitted: [23424, 167542, 457457, 896722],
      writePermitted: [23424, 457457]
    });
  } else { // TODO implement
    res.status(400).json({
      message: "The enumeration of all inventories is not permitted."
    });
  } // TODO implement
}
}

