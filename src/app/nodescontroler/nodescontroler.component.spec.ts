import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodescontrolerComponent } from './nodescontroler.component';

describe('NodescontrolerComponent', () => {
  let component: NodescontrolerComponent;
  let fixture: ComponentFixture<NodescontrolerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodescontrolerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodescontrolerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
