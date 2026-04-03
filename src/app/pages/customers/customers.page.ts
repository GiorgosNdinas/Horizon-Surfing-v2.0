import { CustomerService } from './../../servicies/customer.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AddCustomerButtonComponent } from './components/add-customer-button/add-customer-button.component';
import { CustomerListComponent } from 'src/app/components/customer-list/customer-list.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>Customers</ion-title>
      <ion-buttons slot="end">
        <app-add-customer-button-component></app-add-customer-button-component>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <app-customer-list [customers]="customerList"></app-customer-list>
  </ion-content>
`,
  styleUrl: './customers.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    CustomerListComponent,
    AddCustomerButtonComponent
  ]
})
export class CustomersPage implements OnInit {
  constructor(private customerService: CustomerService) {
  }
  ngOnInit(): void {
    this.customerService.getUnpaidCustomers();
  }
  
  customerList = this.customerService.dbCustomersSignal;
}
