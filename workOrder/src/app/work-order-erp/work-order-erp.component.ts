import {Component, Inject, PLATFORM_ID} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkCenterDocument, WorkOrderDocument, WorkOrderStatus } from './model';
import { isPlatformBrowser } from '@angular/common';


type ZoomLevel = 'day' | 'week' | 'month';


@Component({
  selector: 'app-work-order-erp',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './work-order-erp.component.html',
  styleUrl: './work-order-erp.component.scss'
})


export class WorkOrderERPComponent {

  screenWidth = 160; // default desktop width
  isBrowser = false;

  zoom: ZoomLevel = 'month';

  workCenters: WorkCenterDocument[] = [
    { docId: 'wc-1', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
    { docId: 'wc-2', docType: 'workCenter', data: { name: 'CNC Machine 1' } },
    { docId: 'wc-3', docType: 'workCenter', data: { name: 'Assembly Station' } },
    { docId: 'wc-4', docType: 'workCenter', data: { name: 'Quality Control' } },
    { docId: 'wc-5', docType: 'workCenter', data: { name: 'Packaging Line' } },
  ];

  workOrders: WorkOrderDocument[] = [
    {
      docId: 'wo-1',
      docType: 'workOrder',
      data: {
        name: 'Centrix Ltd',
        workCenterId: 'wc-1',
        status: 'complete',
        startDate: '2025-10-01',
        endDate: '2025-11-30',
      },
    },
    
    {
      docId: 'wo-3',
      docType: 'workOrder',
      data: {
        name: 'Compleks Systems',
        workCenterId: 'wc-1',
        status: 'open',
        startDate: '2026-02-01',
        endDate: '2026-04-30',
      },
    },

    {
      docId: 'wo-2',
      docType: 'workOrder',
      data: {
        name: 'Order A',
        workCenterId: 'wc-2',
        status: 'in-progress',
        startDate: '2025-12-01',
        endDate: '2026-01-31',
      },
    },

    
    {
      docId: 'wo-4',
      docType: 'workOrder',
      data: {
        name: 'McMarrow Distribution',
        workCenterId: 'wc-4',
        status: 'blocked',
        startDate: '2026-04-01',
        endDate: '2026-05-31',
      },
    },
    {
      docId: 'wo-5',
      docType: 'workOrder',
      data: {
        name: 'Order B',
        workCenterId: 'wc-3',
        status: 'open',
        startDate: '2026-02-01',
        endDate: '2026-03-31',
      },
    },
    {
      docId: 'wo-6',
      docType: 'workOrder',
      data: {
        name: 'Order C',
        workCenterId: 'wc-3',
        status: 'blocked',
        startDate: '2026-05-01',
        endDate: '2026-06-30',
      },
    },

     {
      docId: 'wo-7',
      docType: 'workOrder',
      data: {
        name: 'Order D',
        workCenterId: 'wc-3',
        status: 'in-progress',
        startDate: '2025-08-01',
        endDate: '2025-09-30',
      },
    },

     {
      docId: 'wo-8',
      docType: 'workOrder',
      data: {
        name: 'Order E',
        workCenterId: 'wc-3',
        status: 'complete',
        startDate: '2025-11-01',
        endDate: '2025-12-31',
      },
    },
  ];

  
  // slide-out panel state

  panelOpen = false;
  isEdit = false;
  selectedCenter: WorkCenterDocument | null = null;
  selectedOrder: WorkOrderDocument | null = null;
  form!: FormGroup;
  errorMessage = '';

  constructor(
   private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
      this.isBrowser = isPlatformBrowser(this.platformId);

      if (this.isBrowser) {
      this.updateScreenWidth();
      window.addEventListener('resize', () => this.updateScreenWidth());
      }

      this.buildForm();
    }

  ngAfterViewInit() { 
  
    setTimeout(() => { 
  
    this.scrollToToday(); 
    }, 0); 
  }


  updateScreenWidth() {
    const w = window.innerWidth;

    if (w <= 600) this.screenWidth = 90;      // mobile
    else if (w <= 900) this.screenWidth = 120; // tablet
    else this.screenWidth = 160;               // desktop
  }

  buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      status: ['open' as WorkOrderStatus, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  // zoom label cells 
 
  getWeekdayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  baseDate = new Date(2025, 7, 1); // Aug 1, 2025
  endDate = new Date(2026, 5, 30); // June 30, 2026

  get pxPerDay(): number {
    if (this.zoom === 'day')   return this.screenWidth;      // 1 day = 1 column
    if (this.zoom === 'week')  return this.screenWidth / 7;  // 7 days = 1 column
    if (this.zoom === 'month') return this.screenWidth / 30; // ~30 days = 1 column
    return this.screenWidth;
  }

  private daysBetween(a: Date, b: Date): number {
    const ms = b.getTime() - a.getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }


  get headerCells(): string[] {
    // MONTH VIEW
    if (this.zoom === 'month') {
      const months: string[] = [];
      const current = new Date(this.baseDate);

      while (current <= this.endDate) {
        months.push(
        current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        );
        current.setMonth(current.getMonth() + 1);
      }

      return months;
    }

    // WEEK VIEW
    if (this.zoom === 'week') {
      const totalDays = this.daysBetween(this.baseDate, this.endDate) + 1;
      const totalWeeks = Math.ceil(totalDays / 7);

      return Array.from({ length: totalWeeks }, (_, i) => `Week ${i + 1}`);
    }

    // DAY VIEW
    if (this.zoom === 'day') {
      const totalDays = this.daysBetween(this.baseDate, this.endDate) + 1;

      return Array.from({ length: totalDays }, (_, i) => {
        const d = new Date(this.baseDate);
        d.setDate(this.baseDate.getDate() + i);

        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      });
    }


    return [];
  }


getDateFromColumn(colIndex: number): Date {
  const base = new Date(this.baseDate);

  if (this.zoom === 'month') {
    return new Date(base.getFullYear(), base.getMonth() + colIndex, 1);
  }

  if (this.zoom === 'week') {
    const d = new Date(base);
    d.setDate(d.getDate() + colIndex * 7);
    return d;
  }

  const d = new Date(base);
  d.setDate(d.getDate() + colIndex);
  return d;
}


  // open create panel from empty area to create new order
  
 onEmptyClick(center: WorkCenterDocument, colIndex: number) {
    this.panelOpen = true;
    this.isEdit = false;
    this.selectedCenter = center;
    this.selectedOrder = null;
    this.errorMessage = '';

    const start = this.getDateFromColumn(colIndex);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    this.form.setValue({
      name: '',
      status: 'open',
      startDate: start.toISOString().substring(0, 10),
      endDate: end.toISOString().substring(0, 10),
    });

    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }


// It will open edit panel from bar menu to edit order

onEdit(order: WorkOrderDocument) {
  this.panelOpen = true;
  this.isEdit = true;

  this.selectedOrder = {
    ...order,
    data: { ...order.data }
  };

  this.selectedCenter =
    this.workCenters.find(c => c.docId === order.data.workCenterId) || null;

  this.errorMessage = '';

  this.form.setValue({
    name: this.selectedOrder.data.name,
    status: this.selectedOrder.data.status,
    startDate: this.selectedOrder.data.startDate,
    endDate: this.selectedOrder.data.endDate,
  });

  this.form.markAllAsTouched();
  this.form.updateValueAndValidity();
}


 // wchcih delete the order

  onDelete(order: WorkOrderDocument) {
    this.workOrders = this.workOrders.filter(o => o.docId !== order.docId);
  }

  closePanel() {
    this.panelOpen = false;
    this.selectedCenter = null;
    this.selectedOrder = null;
    this.errorMessage = '';
  }

 
  private parseIsoDateLocal(iso: string): Date {
    // iso is 'yyyy-MM-dd'
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d); // local date, no timezone shift
  }


//It will not allow user to create overlap order on same work-center

hasOverlap(startIso: string, endIso: string): boolean {
  if (!this.selectedCenter) return false;

  const startDate = this.parseIsoDateLocal(startIso);
  const endDate   = this.parseIsoDateLocal(endIso);

  if (endDate < startDate) {
    this.errorMessage = 'End date cannot be before start date.';
    return true;
  }

  const start = startDate.getTime();
  const end   = endDate.getTime();
  const centerId = this.selectedCenter.docId;
  const ignoreId = this.isEdit && this.selectedOrder ? this.selectedOrder.docId : null;

  const overlap = this.workOrders.some(o => {
    if (o.data.workCenterId !== centerId) return false;
    if (ignoreId && o.docId === ignoreId) return false;

    const s = this.parseIsoDateLocal(o.data.startDate).getTime();
    const e = this.parseIsoDateLocal(o.data.endDate).getTime();

    return start <= e && end >= s; // inclusive overlap
  });

  if (overlap) {
    this.errorMessage = 'Overlapping order is not allowed on this work center.';
  }

  return overlap;
}

// Apply when user clicks Save (edit mode) or Create (new order).

onSubmit() {
  if (this.form.invalid || !this.selectedCenter) return;

  let { name, status, startDate, endDate } = this.form.value;

  // startDate/endDate from <input type="date"> are already 'yyyy-MM-dd' in most browsers,
  // but we normalize via local parsing to be safe:
  const startLocal = this.parseIsoDateLocal(startDate);
  const endLocal   = this.parseIsoDateLocal(endDate);

  const startIso = startLocal.toISOString().substring(0, 10);
  const endIso   = endLocal.toISOString().substring(0, 10);

  if (this.hasOverlap(startIso, endIso)) {
    return;
  }

  this.errorMessage = '';

  if (this.isEdit && this.selectedOrder) {
    this.workOrders = this.workOrders.map(o =>
      o.docId === this.selectedOrder!.docId
        ? {
            ...o,
            data: {
              ...o.data,
              name,
              status,
              startDate: startIso,
              endDate: endIso
            }
          }
        : o
    );
  } else {
    const newOrder: WorkOrderDocument = {
      docId: crypto.randomUUID(),
      docType: 'workOrder',
      data: {
        name,
        status,
        workCenterId: this.selectedCenter.docId,
        startDate: startIso,
        endDate: endIso,
      },
    };

    this.workOrders = [...this.workOrders, newOrder];
  }

  this.closePanel();
  setTimeout(() => this.scrollToToday(), 0);
}


  statusClass(status: WorkOrderStatus): string {
    return `status-pill status-${status}`;
  }


get cellWidth(): number {
  if (!this.isBrowser) return 160; // SSR / fallback

  const w = window.innerWidth;
  if (w <= 600) return 90;     // mobile
  if (w <= 900) return 120;    // tablet
  return 160;                  // desktop
}


//performs all zoom‑level calculations

getBarStyle(order: WorkOrderDocument): { [key: string]: string } {
  const start = this.parseIsoDateLocal(order.data.startDate);
  const end   = this.parseIsoDateLocal(order.data.endDate);

  const startDayOffset = this.daysBetween(this.baseDate, start);
  const endDayOffset   = this.daysBetween(this.baseDate, end);

  let startIndex = 0;
  let endIndex = 0;

  if (this.zoom === 'day') {
    startIndex = Math.max(0, startDayOffset);
    endIndex   = Math.max(startIndex, endDayOffset);
  }

  if (this.zoom === 'week') {
    const startWeek = Math.floor(startDayOffset / 7);
    const endWeek   = Math.floor(endDayOffset / 7);

    startIndex = Math.max(0, startWeek);
    endIndex   = Math.max(startIndex, endWeek);
  }

  if (this.zoom === 'month') {
    const monthDiffStart =
      (start.getFullYear() - this.baseDate.getFullYear()) * 12 +
      (start.getMonth() - this.baseDate.getMonth());

    const monthDiffEnd =
      (end.getFullYear() - this.baseDate.getFullYear()) * 12 +
      (end.getMonth() - this.baseDate.getMonth());

    startIndex = Math.max(0, monthDiffStart);
    endIndex   = Math.max(startIndex, monthDiffEnd);
  }

  const colWidth = this.cellWidth;

  const left = startIndex * colWidth + 8;
  const rawWidth = (endIndex - startIndex + 1) * colWidth - 16;
  const width = Math.max(colWidth * 0.3, rawWidth);

  return {
    left: `${left}px`,
    width: `${width}px`,
    boxSizing: 'border-box'
  };
}

openMenuFor: string | null = null;


toggleMenu(order: WorkOrderDocument, event: MouseEvent) {
  event.stopPropagation();
  this.openMenuFor = this.openMenuFor === order.docId ? null : order.docId;
}


closeMenu() {
  this.openMenuFor = null;
}

// current day-week- month indicator

get todayLineLeft(): string {
  const col = this.getTodayColumnIndex();
  const colWidth = this.cellWidth;
  return `${col * colWidth + colWidth / 2}px`;
}

scrollToToday() {
  if (!this.isBrowser) return;

  const container = document.querySelector('.timeline-column') as HTMLElement;
  if (!container) return;

  const todayIndex = this.getTodayColumnIndex();
  const maxIndex   = this.headerCells.length - 1;
  const clampedIdx = Math.max(0, Math.min(todayIndex, maxIndex));

  const colWidth  = this.cellWidth;
  const viewportW = container.clientWidth;

  const targetLeft =
    clampedIdx * colWidth + colWidth / 2 - viewportW / 2;

  container.scrollTo({
    left: Math.max(0, targetLeft),
    behavior: 'smooth'
  });
}


getTodayColumnIndex(): number {
  const today = new Date();

  const clamped =
    today < this.baseDate ? this.baseDate :
    today > this.endDate  ? this.endDate  :
    today;

  const dayOffset = this.daysBetween(this.baseDate, clamped);

  if (this.zoom === 'day') return dayOffset;
  if (this.zoom === 'week') return Math.floor(dayOffset / 7);

  return (
    (clamped.getFullYear() - this.baseDate.getFullYear()) * 12 +
    (clamped.getMonth() - this.baseDate.getMonth())
  );
}


isCurrentPeriod(index: number): boolean {
  const today = new Date();

  if (this.zoom === 'month') {
    const monthIndex =
      (today.getFullYear() - this.baseDate.getFullYear()) * 12 +
      (today.getMonth() - this.baseDate.getMonth());
    return index === monthIndex;
  }

  if (this.zoom === 'week') {
    const dayOffset = this.daysBetween(this.baseDate, today);
    const weekIndex = Math.floor(dayOffset / 7);
    return index === weekIndex;
  }

  if (this.zoom === 'day') {
    const dayIndex = this.daysBetween(this.baseDate, today);
    return index === dayIndex;
  }

  return false;
}


getCurrentLabel(): string {
  if (this.zoom === 'month') return 'Current Month';
  if (this.zoom === 'week') return 'Current Week';
  if (this.zoom === 'day') return 'Today';
  return '';
}

onZoomChange(newZoom: ZoomLevel) {
  this.zoom = newZoom;

  if (!this.isBrowser) return;

  // wait for DOM to update with new headerCells & grid
  setTimeout(() => {
    this.scrollToToday();
  }, 0);
}


}
