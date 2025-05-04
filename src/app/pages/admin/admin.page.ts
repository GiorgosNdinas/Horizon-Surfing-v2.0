import { CustomerService } from './../../servicies/customer.service';
import { IonHeader, IonButtons, IonBackButton, IonTitle, IonButton, IonToolbar, IonContent } from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { CustomerListComponent } from "../customers/customer-list/customer-list.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Admin</ion-title>
        <ion-buttons slot="end">
          <ion-button id="admin-login-alert" fill="outline" color="success">Export</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-customer-list></app-customer-list>
    </ion-content>
  `,
  styles: ``,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonContent,
    CustomerListComponent
],
})
export class AdminPage implements OnInit {
  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.customerService.getCustomers();
  }
}