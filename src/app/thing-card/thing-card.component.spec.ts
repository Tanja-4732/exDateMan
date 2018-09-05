import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingCardComponent } from './thing-card.component';

describe('ThingCardComponent', () => {
  let component: ThingCardComponent;
  let fixture: ComponentFixture<ThingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
