import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { IonAlert, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonRow, IonTitle, IonToolbar, IonInput } from '@ionic/angular/standalone';
import { CustomerService } from 'src/app/servicies/customer.service';
import { Customer } from 'src/app/models/customer.model';
import { LessonsService } from 'src/app/servicies/lessons.service';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { ActivityListComponent } from "../../../components/activity-list/activity-list.component";
import { ActivityService } from 'src/app/servicies/activity.service';

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
        <!-- @if(this.customerForDisplay.paid){ -->
        @if(true){
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
        <!-- @if(!this.customerForDisplay.paid){ -->
        @if(false){
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
      <ion-card-header class="my-bill-header">
        <ion-card-title>My Bill</ion-card-title>
        <ion-button>New activity</ion-button>
      </ion-card-header>
      <ion-card-content>
        <app-activity-list [activities]="getActivitiesForCustomer()"  ></app-activity-list>
      </ion-card-content>
    </ion-card>
    <ion-item></ion-item>
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
    IonItem,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CustomerFormComponent,
    ActivityListComponent
]
})
export class CustomerDetailsPage implements OnInit {
  @Input() id!: number;
  customerForDisplay!: Customer;
  customerService = inject(CustomerService);
  lessonsService = inject(LessonsService);
  activityService = inject(ActivityService);

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
    this.customerForDisplay = this.customerService.dbCustomers()[this.id - 1];
  }

  getActivitiesForCustomer(){
    this.activityService.getActivityForCustomer(this.customerForDisplay.id!)
    .then((result) => {
      return result.values
    }).catch((error) => {
      console.error(error);
      console.error(error)
    }).finally(() => {});
    return []
  }

  updateCustomerPayment(ev: any) {
    if (ev.detail.role === "confirm") {
      this.customerForDisplay.paid = (this.customerForDisplay.paid == 0)? 1 : 0;
      this.customerService.updateCustomer(this.customerForDisplay);
    }
  }
}
