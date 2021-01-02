import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeshandlerComponent } from './nodeshandler.component';

describe('NodeshandlerComponent', () => {
  let component: NodeshandlerComponent;
  let fixture: ComponentFixture<NodeshandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeshandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeshandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
