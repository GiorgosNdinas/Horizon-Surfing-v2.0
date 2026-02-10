import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonSelect, IonSelectOption, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { CustomerListComponent } from 'src/app/components/customer-list/customer-list.component';
import { CustomerService } from 'src/app/servicies/customer.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button defaultHref="/team"></ion-back-button>
      </ion-buttons>
      <ion-title>Admin</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="onExport()">Export</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item>
      <ion-label>Year</ion-label>
      <ion-select [value]="selectedYear()" (ionChange)="onYearChange($event.detail.value)">
        @for(year of yearOptions; track year){
          <ion-select-option [value]="year">{{year}}</ion-select-option>
        }
      </ion-select>
    </ion-item>

    <app-customer-list [customers]="customerList"></app-customer-list>
  </ion-content>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    CustomerListComponent
  ]
})
export class AdminPage implements OnInit {
  readonly currentYear = new Date().getFullYear();
  readonly yearOptions = Array.from({ length: 6 }, (_, index) => this.currentYear - index);
  selectedYear = signal(this.currentYear);

  customerList = this.customerService.dbCustomersSignal;

  constructor(
    private customerService: CustomerService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.customerService.getCustomersByYear(this.selectedYear());
  }

  async onYearChange(year: number) {
    this.selectedYear.set(Number(year));
    await this.customerService.getCustomersByYear(this.selectedYear());
  }

  async onExport() {
    const toast = await this.toastController.create({
      message: 'Export coming soon',
      duration: 2000,
      color: 'medium'
    });
    await toast.present();
  }
}
