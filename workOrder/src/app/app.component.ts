import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { WorkOrderERPComponent } from './work-order-erp/work-order-erp.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WorkOrderERPComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
 
}
