import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThingComponent } from './add-thing.component';

describe('AddThingComponent', () => {
  let component: AddThingComponent;
  let fixture: ComponentFixture<AddThingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddThingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddThingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
