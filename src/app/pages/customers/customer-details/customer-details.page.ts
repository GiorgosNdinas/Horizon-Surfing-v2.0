import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { IonAlert, IonBackButton, IonButton, IonButtons, IonCard, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CustomerFormComponent } from "../customer-components/customer-form/customer-form.component";
import { CustomerService } from 'src/app/servicies/customer.service';
import { Customer } from 'src/app/models/customer.model';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>Customer info</ion-title>
      <ion-buttons slot="end">
        @if(this.customerForDisplay.paid){
          <ion-button id="present-alert" fill="outline" color="success">
            <ion-icon slot="start" name="checkmark-outline"></ion-icon>  
            Paid
          </ion-button>
          <ion-alert
            trigger="present-alert"
            header="Are you sure you want to change the customer payment?"
            [buttons]="alertButtons"
            (didDismiss)="updateCustomerPayment($event)"
          ></ion-alert>
        }
        @if(!this.customerForDisplay.paid){
          <ion-button id="present-alert" fill="outline" color="danger">
            <ion-icon slot="start" name="close-outline"></ion-icon>  
            Paid
          </ion-button>
          <ion-alert
            trigger="present-alert"
            header="Are you sure you want to change the customer payment?"
            [buttons]="alertButtons"
            (didDismiss)="updateCustomerPayment($event)"
          ></ion-alert>
        }
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <app-customer-form [customerForDisplay]="customerForDisplay"></app-customer-form>
    <ion-card>
      <ion-item >
        <ion-label>
          <h1>My bill</h1>
        </ion-label>
      </ion-item>
      <ion-list>
        <ion-grid>
          <ion-row>
            <ion-col size="4">Lesson</ion-col>
            <ion-col size="4">Teacher</ion-col>
            <ion-col size="2">Hours</ion-col>
            <ion-col size="2">Cost</ion-col>
          </ion-row>
          <ion-row style="border-top: 1px solid;">
            <ion-col size="10">Total cost:</ion-col>
            <ion-col size="2">Cost</ion-col>
          </ion-row>
        </ion-grid>
      </ion-list>
    </ion-card>
  </ion-content>
`,
  styleUrl: './customer-details.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonTitle,
    IonContent,
    IonIcon,
    IonAlert,
    IonCard,
    IonList,
    IonGrid,
    IonItem,
    IonLabel,
    IonRow,
    IonCol,
    CustomerFormComponent
  ]
})
export class CustomerDetailsPage implements OnInit {
  @Input() id!: number;
  customerForDisplay!: Customer;
  customerService = inject(CustomerService);

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      role: 'confirm',
    },
  ];

  ngOnInit(): void {
    this.customerForDisplay = this.customerService.customers()[this.id - 1];
  }

  updateCustomerPayment(ev: any) {
    if (ev.detail.role === "confirm") {
      this.customerForDisplay.paid = !this.customerForDisplay.paid;
      // this.updateCustomerDetails();
      // TODO: Update customer list
      this.customerService.customers()[this.id - 1] = this.customerForDisplay;
    }
  }
}
