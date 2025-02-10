import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonCard, IonCardContent, IonSegment, IonSegmentButton, IonLabel,  } from '@ionic/angular/standalone';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [
    IonHeader,
    RouterLink,
    IonButton,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonCard,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button [routerLink]="['../']">Back</ion-button>
      </ion-buttons>
      <ion-title>New activity</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-card>
      <ion-card-content>
        <ion-segment>
          <ion-segment-button content-id="lesson">
            <ion-label>Lesson</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="rental">
            <ion-label>Rental</ion-label>
          </ion-segment-button>
        </ion-segment>
        <!-- <ion-segment-view>
          <ion-segment-content id="lesson">First</ion-segment-content>
          <ion-segment-content id="rental">Second</ion-segment-content>
        </ion-segment-view> -->
      </ion-card-content>
    </ion-card>
  </ion-content>
  `,
  styleUrl: './new-activity.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewActivityComponent implements OnInit {
  customerId: number;

  constructor(private route: ActivatedRoute) {
    // Extract the customer ID from the URL. Url example: /1/new-activity
    this.customerId = Number(this.route.snapshot.url.join('/').split('/')[0]);
  }

  ngOnInit() {
    console.log('Current ID:', this.customerId);
  }
}
