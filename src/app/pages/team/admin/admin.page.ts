import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, ToastController } from "@ionic/angular/standalone";
import { CustomerService } from 'src/app/servicies/customer.service';
import { CustomerListComponent } from "src/app/components/customer-list/customer-list.component";
import { ExportButtonComponent } from "src/app/components/export-button/export-button.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, CustomerListComponent, ExportButtonComponent],
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button defaultHref="/team"></ion-back-button>
      </ion-buttons>
      <ion-title>Admin
      </ion-title>
      <ion-item slot="end">
        <ion-label class="label-year">Year</ion-label>
        <ion-select [value]="selectedYear()" (ionChange)="onYearChange($event.detail.value)">
          @for(year of yearOptions; track year){
            <ion-select-option [value]="year">{{ year}}</ion-select-option>
          }
        </ion-select>
      </ion-item>
      <ion-buttons slot="end">
        <app-export-button [customersForExport]="customerList()" [selectedYear]="selectedYear"></app-export-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <app-customer-list [customers]="customerList"></app-customer-list>
  </ion-content>
  `,
  styleUrl: './admin.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPage implements OnInit {

  readonly currentYear = new Date().getFullYear();
  readonly yearOptions = Array.from({ length: 6 }, (_, index) => this.currentYear - index);
  selectedYear = signal(this.currentYear);

  customerList = this.customerService.dbCustomersSignal;

  constructor(private customerService: CustomerService, private toastController: ToastController) { }

  async ngOnInit() {
    await this.customerService.getCustomersByYear(this.selectedYear());
  }

  async onYearChange(year: number) {
    this.selectedYear.set(year);
    await this.customerService.getCustomersByYear(this.selectedYear());
  }
}
