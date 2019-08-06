import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditThingComponent } from './edit-thing.component';

describe('EditThingComponent', () => {
  let component: EditThingComponent;
  let fixture: ComponentFixture<EditThingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditThingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditThingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
