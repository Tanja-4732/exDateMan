import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../models/inventory';

@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.scss']
})
export class InventoriesComponent implements OnInit {
  inventories: Inventory[];


  constructor() { }

  ngOnInit() {
  }

}
