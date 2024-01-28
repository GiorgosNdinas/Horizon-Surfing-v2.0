import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TeamMember } from 'src/app/models/team-members.modal';
import { TeamMemberService } from 'src/app/servicies/team-member.service';

@Component({
  selector: 'app-team-member-students',
  standalone: true,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButtons,
    IonButton,
    IonIcon
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>My students</ion-card-title>
        <ion-button  size="small" id="open-new-customer-modal" expand="block" fill="outline">
          <ion-icon slot="start" name="attach-outline"></ion-icon>            
          <span class="add-customer-button-text">Attach student</span>
        </ion-button>
        <!-- <ion-buttons slot="end">
          <ion-button id="open-new-customer-modal" expand="block" fill="outline">
            <ion-icon slot="start" name="add-outline"></ion-icon>            
            <span class="add-customer-button-text">Attach student</span>
          </ion-button> -->
        <!-- New customer Modal -->
        <!-- <ion-modal backdropDismiss="false" trigger="open-new-customer-modal" (willDismiss)="onWillDismiss($event)">
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
        </ion-modal> -->
      <!-- </ion-buttons> -->
      </ion-card-header>

      <ion-card-content>
        <!-- <app-search-student [teamMember]="teamMember"></app-search-student> -->
      </ion-card-content>
    </ion-card>
  `,
  styles: `
    ion-card-header{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  `
})
export class TeamMemberStudentsComponent {
  @Input() id: number | undefined;
  @Input() teamMember: TeamMember | undefined;
}

@Component({
  selector: 'app-team-member',
  standalone: true,
  imports: [
    TeamMemberStudentsComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonRow,
    IonCol,
    IonAvatar,
    IonItem
  ],
  template: ` 
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>Team member</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    @if(teamMember){
      <ion-card>
        <ion-row>
          <ion-col size="3">
            <ion-avatar aria-hidden="true">
              <img  [src]="teamMember.profilePic" />
            </ion-avatar>
          </ion-col>
          <ion-col size="9">
            <ion-item lines="none">
              <h1>{{teamMember.name}} {{teamMember.surname}}</h1>
            </ion-item>
            <ion-item lines="none">
              <h4>{{teamMember.subject}}</h4>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="3"></ion-col>
          <ion-col size="9">
            <ion-item lines="none">
              <label>Hours this month: {{teamMember.hoursTaughtThisMonth}}</label>
            </ion-item>
            <ion-item lines="none">
              <label>Total hours: {{teamMember.totalHoursTaught}}</label>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-card>
      <app-team-member-students [id]="id" [teamMember]="teamMember"></app-team-member-students>
    }
  </ion-content>
`,
  styles: `
    ion-avatar{
      margin: 15px auto;
    }
    ion-item h1,h4{
      margin: auto;
    }
    ion-item h4{
      color: grey;
      margin-top: 0px;
    }
    ion-item label{
      margin: auto;
      color: grey;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamMemberComponent implements OnInit {
  @Input() id: number | undefined;
  teamMember: TeamMember | undefined;

  // TODO: Change the service
  public teamMemberService = inject(TeamMemberService);
  public router = inject(Router)

  ngOnInit(): void {
    this.findTeamMember()
  }

  findTeamMember() {
    const index = this.teamMemberService.teamMembers().findIndex(item => item.id == this.id)
    if (index !== -1)
      this.teamMember = this.teamMemberService.teamMembers()[index];
  }
}
