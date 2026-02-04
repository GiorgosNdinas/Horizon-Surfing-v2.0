import { Activity } from './../../../models/activity.modal';
import { CustomerService } from './../../../servicies/customer.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { IonAlert, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonRow, IonTitle, IonToolbar, IonInput, IonModal, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { Customer } from 'src/app/models/customer.model';
import { LessonsService } from 'src/app/servicies/lessons.service';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { ActivityListComponent } from "../../../components/activity-list/activity-list.component";
import { RouterLink } from '@angular/router';
import { ActivityService } from 'src/app/servicies/activity.service';
import { ErrorService } from 'src/app/servicies/error.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  template: `
  <ion-header >
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
    <app-customer-form [customer]="customerForDisplay" [editableForm]="editableForm" (customerSubmitted)="updateCustomer($event)"></app-customer-form>
    <ion-fab slot="fixed" vertical="top" horizontal="end" (click)="toggleEdit()">
      <ion-fab-button>
        <ion-icon name="create-outline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-card>
      <ion-card-header class="my-bill-header">
        <ion-card-title>My Bill</ion-card-title>
        <ion-button [routerLink]="['./new-activity']" >New activity</ion-button>
      </ion-card-header>
      <ion-card-content>
        <app-activity-list [activitiesForCustomer]="customerActivitiesForDisplay"  ></app-activity-list>
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
    ActivityListComponent,
    RouterLink,
    IonFab,
    IonFabButton
]
})
export class CustomerDetailsPage implements OnInit {
  @Input() id!: number;

  editableForm = signal<boolean>(false);

  lessonsService = inject(LessonsService);
  customerService = inject(CustomerService);
  activitiesService = inject(ActivityService);
  errors = inject(ErrorService);


  customerForDisplay!: Customer;
  customerActivitiesForDisplay = computed<Activity[]>(() => {
    return this.activitiesService.dbActivitiesForCustomer();
  });


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
    this.customerForDisplay = computed<Customer>(() => {
      return this.customerService.dbCustomersSignal().find((customer) => customer.id == Number(this.id))!;
    }
    )();
    // this.customerForDisplay = this.customerService.dbCustomersSignal().find((customer) => customer.id == Number(this.id))!;
    this.activitiesService.getActivityForCustomer(this.id);
  }

  toggleEdit(): void {
    this.editableForm.update((value) => !value);
  }

  updateCustomer(updatedCustomer: Customer) {
    updatedCustomer.id = this.customerForDisplay.id;
    this.customerService.updateCustomer(updatedCustomer)
      .then(() => {
        // To be changed: show a toast message instead of console log
        console.log('Customer updated successfully');
        this.toggleEdit();
      })
      .catch((error) => {
        // To be changed: show a toast message instead of console error
        console.error('Error updating customer:', error);
        this.errors.showError(`There was an error updating the customer: ${error}`, error);
      });
  }

  updateCustomerPayment(ev: any) {
    if (ev.detail.role === "confirm") {
      this.customerForDisplay.paid = (this.customerForDisplay.paid == 0) ? 1 : 0;
      this.customerService.updateCustomer(this.customerForDisplay)
        .then(() => {
          // To be changed: show a toast message instead of console log
          console.log('Customer payment updated successfully');
        })
        .catch((error) => {
          // To be changed: show a toast message instead of console error
          console.error('Error updating customer payment:', error);
          this.errors.showError(`There was an error updating the customer payment: ${error}`, error);
        });
    }
  }
}
