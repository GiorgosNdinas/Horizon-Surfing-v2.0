import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-customer-button-component',
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
  ],
  template: `
    <ion-button expand="block" fill="outline" (click)="navigateToPage('add-customer')">
      <ion-icon slot="start" name="add-outline"></ion-icon>            
      <span class="add-customer-button-text">Add customer</span>
     </ion-button>
  `,
  styleUrl: './add-customer-button-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCustomerButtonComponent {
  constructor(private router: Router) {
  }

  navigateToPage(page: string) {
    this.router.navigate([`customers/${page}`]);
  }

}
