import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderERP1Component } from './work-order-erp1.component';

describe('WorkOrderERP1Component', () => {
  let component: WorkOrderERP1Component;
  let fixture: ComponentFixture<WorkOrderERP1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderERP1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkOrderERP1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
