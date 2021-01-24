import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathlogsComponent } from './pathlogs.component';

describe('PathlogsComponent', () => {
  let component: PathlogsComponent;
  let fixture: ComponentFixture<PathlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathlogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
