import { Inventory } from "server/models/inventoryModel";

const inventory = new Inventory();
inventory.InventoryId = 1;
inventory.InventoryCreatedOn = new Date();
inventory.InventoryName = "Bernd's fridge";
await repository.save(inventory);

const allUsers = await repository.find();
const firstUser = await repository.findOne(1); // find by id
const timber = await repository.findOne({ firstName: "Timber", lastName: "Saw" });

await repository.remove(timber);
// https://github.com/typeorm/typeorm
