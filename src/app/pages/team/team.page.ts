import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCard, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonModal, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TeamMemberFormComponent } from "./team-components/team-member-form/team-member-form.component";
import { OverlayEventDetail } from '@ionic/core/components';
import { TeamMemberService } from 'src/app/servicies/team-member.service';
import { TeamMember } from 'src/app/models/team-members.modal';
import { LoadFilesService } from 'src/app/servicies/load-files.service';


type TeamMemberDisplay = TeamMember & { id?: number | string; role?: string };

@Component({
    selector: 'app-team',
    standalone: true,
    template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" >
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Team</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <div class="grid-container">
          @for(teamMember of this.teamMembersForDisplay(); track $index){
            @if (teamMember.id == -1) {
              <ion-card>
                <ion-row>
                  <ion-col size="3">
                    <ion-avatar aria-hidden="true">
                      <img  [src]="getProfilePic(teamMember)" />
                    </ion-avatar>
                  </ion-col>
                  <ion-col size="9">
                    <ion-item lines="none">
                      <h1>{{teamMember.name}} {{teamMember.surname}}</h1>
                    </ion-item>
                    @if (teamMember.role) {
                      <ion-item lines="none">
                        <h2>{{teamMember.role}}</h2>
                      </ion-item>
                    }
                  </ion-col>
                </ion-row>
              </ion-card>
            } @else {
              <ion-card [routerLink]="[teamMember.id]">
                <ion-row>
                  <ion-col size="3">
                    <ion-avatar aria-hidden="true">
                      <img  [src]="getProfilePic(teamMember)" />
                    </ion-avatar>
                  </ion-col>
                  <ion-col size="9">
                    <ion-item lines="none">
                      <h1>{{teamMember.name}} {{teamMember.surname}}</h1>
                    </ion-item>
                  </ion-col>
                </ion-row>
              </ion-card>
            }
          }
          <ion-card id="open-new-team-member-modal" style="border: 3px solid; border-style: dotted;">
            <ion-row>
              <ion-col size="3">
                <ion-avatar aria-hidden="true">
                  <img  src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                </ion-avatar>
              </ion-col>
              <ion-col size="9">
                <ion-item lines="none">
                  <h1>Add new</h1>
                </ion-item>
                <ion-item lines="none">
                  <h2>Team member</h2>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-card>
          <ion-modal backdropDismiss="false" trigger="open-new-team-member-modal" (willDismiss)="onWillDismiss($event)">
            <ng-template>
              <ion-header>
                <ion-toolbar>
                  <ion-buttons slot="start">
                    <ion-button (click)="cancel()">Cancel</ion-button>
                  </ion-buttons>
                  <ion-title>New Team Member</ion-title>
                </ion-toolbar>
              </ion-header>
              <ion-content>
                <app-team-member-form></app-team-member-form>
              </ion-content>
            </ng-template>
          </ion-modal>
        </div>
      </ion-grid>
    </ion-content>
  `,
    styles: `
    .grid-container{
      display: grid;
      grid-template-columns: auto auto;
    }
    ion-avatar{
      margin: 15px auto;
    }
    ion-item h1,h2{
      margin: auto;
    }
    ion-item h1{
      font-weight: 600;
    }
    ion-item h2 {
      color: grey;
    }
    @media only screen and (max-width: 600px){
      .grid-container{
        display: grid;
        grid-template-columns: auto;
      }
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        IonHeader,
        IonToolbar,
        IonButton,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonAvatar,
        IonItem,
        IonCard,
        IonModal,
        TeamMemberFormComponent
    ]
})

export class TeamPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  private readonly adminTeamMember: TeamMemberDisplay = {
    id: -1,
    name: 'Admin',
    surname: '',
    role: 'Admin',
    profilePic: 'https://ionicframework.com/docs/img/demos/avatar.svg'
  };

  
  constructor(public teamMemberService: TeamMemberService, private loadFilesService: LoadFilesService) { }

  async ngOnInit() {
    await this.teamMemberService.getTeamMembers();
    await this.loadFilesService.loadFiles();
  }

  teamMembersForDisplay(): TeamMemberDisplay[] {
    return [this.adminTeamMember, ...this.teamMemberService.dbTeamMembers()];
  }

  // Close the customer modal with a 'cancel' action
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  /**
 * Handles the 'willDismiss' event of the modal.
 * Extracts data from the event and updates the customer list.
 * @param event The event emitted when the modal is about to be dismissed.
 */
  onWillDismiss(event: Event) {
    // Cast the event to a CustomEvent with OverlayEventDetail<string> as the type of the 'detail' property
    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    // Extract the data from the event
    let data: any = ev.detail.data;

    // Check if the dismissal role is 'confirm'
    if (ev.detail.role === 'confirm') {
      console.log('Closed with confirm');
      this.teamMemberService.getTeamMembers();
      this.teamMemberService.getTeamMembers();
    }
  }

  getProfilePic(teamMember: TeamMemberDisplay){
    const index = this.loadFilesService.images().findIndex(image => image.name === teamMember.profilePic);
    if (index !== -1){
      return this.loadFilesService.images()[index].data;
    }else{
      return "https://ionicframework.com/docs/img/demos/avatar.svg";
    }
  }
}