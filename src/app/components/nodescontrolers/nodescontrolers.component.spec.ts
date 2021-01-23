import { ComponentFixture, TestBed } from '@angular/core/testing';

import { nodesControlersComponent } from './nodescontrolers.component';

describe('nodesControlersComponent', () => {
  let component: nodesControlersComponent;
  let fixture: ComponentFixture<nodesControlersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ nodesControlersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(nodesControlersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
