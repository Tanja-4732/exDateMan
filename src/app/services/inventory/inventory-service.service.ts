import { Injectable } from '@angular/core';
import { Inventory } from '../../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryServiceService {

  constructor() { }

  getInventories(): Inventory[] {
    return []; // TODO implement mock or real API client
  }
}
