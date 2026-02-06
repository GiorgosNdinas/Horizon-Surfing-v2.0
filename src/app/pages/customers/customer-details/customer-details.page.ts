import { Activity } from './../../../models/activity.modal';
import { CustomerService } from './../../../servicies/customer.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonTitle, IonToolbar, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { Customer } from 'src/app/models/customer.model';
import { CustomerFormComponent } from '../components/customer-form/customer-form.component';
import { ActivityListComponent } from "../../../components/activity-list/activity-list.component";
import { RouterLink } from '@angular/router';
import { ActivityService } from 'src/app/servicies/activity.service';
import { ErrorService } from 'src/app/servicies/error.service';
import { PaidButtonComponent } from "../components/paid-button/paid-button.component";

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
        <app-paid-button [customer]="customerForDisplay" (customerPaymentUpdated)="updateCustomer($event)"></app-paid-button>
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CustomerFormComponent,
    ActivityListComponent,
    RouterLink,
    IonFab,
    IonFabButton,
    PaidButtonComponent
  ]
})
export class CustomerDetailsPage implements OnInit {
  @Input() id!: number;

  editableForm = signal<boolean>(false);

  customerService = inject(CustomerService);
  activitiesService = inject(ActivityService);
  errors = inject(ErrorService);


  customerForDisplay!: Customer;

  customerActivitiesForDisplay = this.activitiesService.getActivitiesForCustomer();

  async ngOnInit(): Promise<void> {
    this.customerForDisplay = computed<Customer>(() => {
      return this.customerService.dbCustomersSignal().find((customer) => customer.id == Number(this.id))!;
    }
    )();
    await this.activitiesService.getActivityForCustomer(this.id);
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


}
