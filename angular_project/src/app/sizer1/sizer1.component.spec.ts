import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sizer1Component } from './sizer1.component';

describe('Sizer1Component', () => {
  let component: Sizer1Component;
  let fixture: ComponentFixture<Sizer1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sizer1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Sizer1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
