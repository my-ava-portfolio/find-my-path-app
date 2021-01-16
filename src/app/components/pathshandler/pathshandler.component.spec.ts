import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathsHandlerComponent } from './pathshandler.component';

describe('PathshandlerComponent', () => {
  let component: PathsHandlerComponent;
  let fixture: ComponentFixture<PathsHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathsHandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathsHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
