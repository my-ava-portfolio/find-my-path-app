import { ComponentFixture, TestBed } from '@angular/core/testing';

import { pathsHandlerComponent } from './pathshandler.component';

describe('PathshandlerComponent', () => {
  let component: pathsHandlerComponent;
  let fixture: ComponentFixture<pathsHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ pathsHandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(pathsHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
