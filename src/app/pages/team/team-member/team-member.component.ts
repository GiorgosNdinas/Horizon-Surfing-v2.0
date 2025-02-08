import { OverlayEventDetail } from '@ionic/core/components';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonAlert, IonAvatar, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonModal, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TeamMember } from 'src/app/models/team-members.modal';
import { TeamMemberService } from 'src/app/servicies/team-member.service';
import { CustomerService } from 'src/app/servicies/customer.service';
import { Location } from '@angular/common';
import { Customer } from 'src/app/models/customer.model';
import { LoadFilesService } from 'src/app/servicies/load-files.service';
@Component({
  selector: 'app-team-member',
  standalone: true,
  imports: [
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
    IonItem,
    IonButton,
    IonIcon,
    IonAlert
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
    @if(teamMember()){
      <ion-card>
        <ion-row>
          <ion-col size="4">
            <ion-avatar aria-hidden="true">
              <img  [src]="getProfilePic()" />
            </ion-avatar>
          </ion-col>
          <ion-col size="8">
            <ion-item lines="none">
              <h1 style="text-align: center">{{teamMember()?.name}} {{teamMember()?.surname}}</h1>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="4" style="text-align: center;">
            <ion-button id="show-delete-alert" fill="outline" color="danger" size="small">
              <ion-icon slot="start" name="trash-outline"></ion-icon>  
              Delete
            </ion-button>
            <ion-alert
              trigger="show-delete-alert"
              header="Are you sure you want to delete this team member?"
              [buttons]="alertButtons"
              (didDismiss)="deleteTeamMember($event)"
            ></ion-alert>
          </ion-col>
          <ion-col size="8">
            <ion-item lines="none">
              <label>Hours this month:</label>
            </ion-item>
            <ion-item lines="none">
              <label>Total hours: </label>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-card>
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
  teamMember = signal<TeamMember | undefined>(undefined);

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      role: 'confirm',
    },
  ];

  public teamMemberService = inject(TeamMemberService);
  private loadFilesService = inject(LoadFilesService);
  public router = inject(Router)
  private _location = inject(Location);

  ngOnInit(): void {
    this.findTeamMember()
  }

  findTeamMember() {
    const index = this.teamMemberService.dbTeamMembers().findIndex(item => item.id == this.id)
    if (index !== -1)
      this.teamMember.set(this.teamMemberService.dbTeamMembers()[index]) ;
  }

  deleteTeamMember(ev: any) {
    if (ev.detail.role === "confirm") {  
      this.teamMemberService.deleteTeamMember(this.teamMember()!); 
      this._location.back();
    }
    return
  }

  getProfilePic(){
    const index = this.loadFilesService.images.findIndex(image => image.name === this.teamMember()?.profilePic);

    if (index !== -1){
      return this.loadFilesService.images[index].data;
    }else{
      return "https://ionicframework.com/docs/img/demos/avatar.svg"
    }
    
  }
}
