import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesParametersComponent } from './nodesparameters.component';

describe('nodesparametersComponent', () => {
  let component: NodesParametersComponent;
  let fixture: ComponentFixture<NodesParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodesParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
