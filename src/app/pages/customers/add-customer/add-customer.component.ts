import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/servicies/customer.service';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  template: `
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button (click)="cancel()">Cancel</ion-button>
          </ion-buttons>
          <ion-title>New customer</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <app-customer-form [editableForm]="editable" (customerSubmitted)="submitCustomer($event)" ></app-customer-form>
      </ion-content>
  `,
  styleUrl: './add-customer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, CustomerFormComponent],

})
export class AddCustomerComponent {

  constructor(private router: Router, private customerService: CustomerService){}

  editable = signal<boolean>(true);

  // Function for when the cancel button is pressed. The user goes back to the customers page.
  cancel(){
    this.router.navigateByUrl('/customers');
  };

  // This function submits the new customer data received from the customer form component
  submitCustomer(customer: Customer){
    this.customerService.addCustomer(customer)
      .then(() => {
        // To be changed: show a toast message instead of console log
        console.log('Customer added successfully');
        this.navigate(true);
      })
      .catch((error) => {
        // To be changed: show a toast message instead of console error
        console.error('Error adding customer:', error);
        this.navigate(false);
      });

  }

  // This function navigates the user to the customers page if the new customer was submited successfully
  navigate(customerSubmited: boolean){
    if(customerSubmited)
      this.router.navigateByUrl('/customers');
    else
      this.router.navigateByUrl('/home');
  }
 }
