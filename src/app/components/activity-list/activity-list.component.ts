import { IonList, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Activity } from 'src/app/models/activity.modal';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    IonList,
    IonGrid,
    IonRow,
    IonCol
  ],
  template: `
    <ion-list>
      <ion-grid>
        <ion-row style="border-bottom: 1px solid;">
          <ion-col size="4">Activity</ion-col>
          <ion-col size="2">Type</ion-col>
          <ion-col size="4">Duration</ion-col>
          <ion-col size="2">Team Member</ion-col>
        </ion-row>
        @for(activity of this.activities; track $index){
          <ion-row>
            <ion-col size="4">{{activity.name}}</ion-col>
            <ion-col size="2">{{activity.type}}</ion-col>
            <ion-col size="4">{{activity.duration}}</ion-col>
            <ion-col size="2">{{activity.teamMemberId}}</ion-col> <!-- TODO CHANGE SO IT SHOWS THE NAME OF THE MEMBER -->
          </ion-row>
        }
      </ion-grid>
    </ion-list>
  `,
  styleUrl: './activity-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityListComponent {
  @Input() activities: Activity[] = [];
 }
