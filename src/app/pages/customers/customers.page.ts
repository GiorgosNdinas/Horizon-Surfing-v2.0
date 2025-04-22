import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { CustomerService } from 'src/app/servicies/customer.service';
import { Router } from '@angular/router';

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
        <ion-button expand="block" fill="outline" (click)="navigateToPage('add-customer')">
          <ion-icon slot="start" name="add-outline"></ion-icon>            
          <span class="add-customer-button-text">Add customer</span>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <app-customer-list></app-customer-list>
  </ion-content>
`,
  styleUrl: './customers.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonTitle, IonIcon, IonContent,
    CustomerListComponent
  ]
})
export class CustomersPage {
  
  constructor(private router: Router, private customerService: CustomerService){
    this.customerService.getUnpaidCustomers(); // Test this
  }
  navigateToPage(page:string){
    this.router.navigate([`customers/${page}`]);
  }
}
