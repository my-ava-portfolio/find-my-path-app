import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcontrolerComponent } from './viewcontroler.component';

describe('ViewcontrolerComponent', () => {
  let component: ViewcontrolerComponent;
  let fixture: ComponentFixture<ViewcontrolerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewcontrolerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcontrolerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
