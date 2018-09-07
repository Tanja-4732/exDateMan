import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-thing',
  templateUrl: './add-thing.component.html',
  styleUrls: ['./add-thing.component.scss']
})
export class AddThingComponent implements OnInit {

  thingName = 'initial value';
  constructor() { }

  ngOnInit() {
  }

}
