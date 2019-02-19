import { Injectable } from '@angular/core';
import { Inventory } from '../../models/inventory';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryServiceService {

  constructor(private http: HttpClient) { }

  getInventories(): Inventory[] {
    return []; // TODO implement mock or real API client
  }
}
