import { ComponentFixture, TestBed } from '@angular/core/testing';

import { nodescontrolersComponent } from './nodescontrolers.component';

describe('nodesControlersComponent', () => {
  let component: nodescontrolersComponent;
  let fixture: ComponentFixture<nodescontrolersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ nodescontrolersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(nodescontrolersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
