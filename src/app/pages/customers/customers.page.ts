import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';
import { CustomerFormComponent } from "./customer-components/customer-form/customer-form.component";
import { CustomerListComponent } from "./customer-components/customer-form/customer-list/customer-list.component";

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
        <ion-button id="open-new-customer-modal" expand="block" fill="outline">
          <ion-icon slot="start" name="add-outline"></ion-icon>            
          <span class="add-customer-button-text">Add customer</span>
        </ion-button>
        <!-- New customer Modal -->
        <ion-modal trigger="open-new-customer-modal" (willDismiss)="onWillDismiss($event)">
          <ng-template>
            <ion-header>
              <ion-toolbar>
                <ion-buttons slot="start">
                  <ion-button (click)="cancel()">Cancel</ion-button>
                </ion-buttons>
                <ion-title>New customer</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <app-customer-form></app-customer-form>
            </ion-content>
          </ng-template>
        </ion-modal>
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
        CommonModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonTitle, IonIcon, IonModal, IonContent, CustomerFormComponent,
        CustomerListComponent
    ]
})
export class CustomersPage {
  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log(ev.detail.data);
    }
  }
}
