import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thing-card',
  templateUrl: './thing-card.component.html',
  styleUrls: ['./thing-card.component.scss']
})
export class ThingCardComponent implements OnInit {

  thingName = 'Ketchup';
  thingCategory = 'Sauce';

  constructor() { }

  ngOnInit() {
  }

}
