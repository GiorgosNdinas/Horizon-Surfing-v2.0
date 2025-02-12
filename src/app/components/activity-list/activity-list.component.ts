import { TeamMemberService } from 'src/app/servicies/team-member.service';
import { IonList, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
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
          <ion-col size="3">Activity</ion-col>
          <ion-col size="3">Type</ion-col>
          <ion-col size="4">Duration</ion-col>
          <ion-col size="2">Team</ion-col>
        </ion-row>
        @for(activity of this.activities; track $index){
          <ion-row>
            <ion-col size="3">{{activity.name}}</ion-col>
            <ion-col size="3">{{activity.type}}</ion-col>
            <ion-col size="4">{{activity.amount}}</ion-col>
            <ion-col size="2">{{getTeamMemberName(activity.teamMemberId)}}</ion-col>
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
  teamMemberService = inject(TeamMemberService);

  getTeamMemberName(id: number) {
    return this.teamMemberService.getTeamMemberName(Number(id));
  }
 }
