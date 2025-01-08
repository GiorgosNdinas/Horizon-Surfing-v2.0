import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerFormComponent } from '../customer-form/customer-form.component';

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
        <app-customer-form (customerSubmited)="navigate($event)"></app-customer-form>
      </ion-content>
  `,
  styleUrl: './add-customer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, CustomerFormComponent],

})
export class AddCustomerComponent {

  constructor(private router: Router){}

  // Function for when the cancel button is pressed. The user goes back to the customers page.
  cancel(){
    this.router.navigateByUrl('/customers');
  };

  // This function navigates the user to the customers page if the new customer was submited successfully
  navigate(customerSubmited: boolean){
    if(customerSubmited)
      this.router.navigateByUrl('/customers');
  }
 }
