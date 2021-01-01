import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesstatisticsComponent } from './nodesstatistics.component';

describe('NodesstatisticsComponent', () => {
  let component: NodesstatisticsComponent;
  let fixture: ComponentFixture<NodesstatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodesstatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesstatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
