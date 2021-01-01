import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodestopographyComponent } from './nodestopography.component';

describe('NodestopographyComponent', () => {
  let component: NodestopographyComponent;
  let fixture: ComponentFixture<NodestopographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodestopographyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodestopographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
