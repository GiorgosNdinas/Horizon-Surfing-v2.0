import { IonButton, IonIcon, IonAlert } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Customer } from 'src/app/models/customer.model';

@Component({
  selector: 'app-paid-button',
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonAlert
  ],
  template: `
  @if(this.customer.paid){
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
  @if(!this.customer.paid){
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
  `,
  styleUrl: './paid-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaidButtonComponent { 
  @Input() customer!: Customer;

  @Output() customerPaymentUpdated = new EventEmitter<Customer>();

  alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      role: 'confirm',
    },
  ];

  updateCustomerPayment(event: any){
    if(event.detail.role === 'confirm'){
      this.customer.paid = (this.customer.paid == 0) ? 1 : 0;
      this.customerPaymentUpdated.emit(this.customer);
    }
    else{
      // To be changed: show a toast message instead of console log
      console.log('Customer payment update cancelled');
    }
  }
}
