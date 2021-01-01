import { ComponentFixture, TestBed } from '@angular/core/testing';

import { inputParametersComponent } from './inputparameters.component';

describe('inputParametersComponent', () => {
  let component: inputParametersComponent;
  let fixture: ComponentFixture<inputParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ inputParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(inputParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
