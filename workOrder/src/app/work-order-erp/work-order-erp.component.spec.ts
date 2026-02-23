import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderERPComponent } from './work-order-erp.component';

describe('WorkOrderERPComponent', () => {
  let component: WorkOrderERPComponent;
  let fixture: ComponentFixture<WorkOrderERPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderERPComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkOrderERPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
