import { OverlayEventDetail } from '@ionic/core/components';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonAlert, IonAvatar, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonModal, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TeamMember } from 'src/app/models/team-members.modal';
import { TeamMemberService } from 'src/app/servicies/team-member.service';
import { AttachStudentComponent } from "../team-components/team-member-attach-student/attach-student.component";
import { MyStudentsComponent } from "../team-components/team-memeber-my-students/my-students.component";
import { CustomerService } from 'src/app/servicies/customer.service';
import { Location } from '@angular/common';
import { Customer } from 'src/app/models/customer.model';
import { LoadFilesService } from 'src/app/servicies/load-files.service';

@Component({
  selector: 'app-team-member-students',
  standalone: true,
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>My students</ion-card-title>
        <ion-button  size="small" id="open-new-customer-modal" expand="block" fill="outline">
          <ion-icon slot="start" name="attach-outline"></ion-icon>            
          <span class="add-customer-button-text">Attach student</span>
        </ion-button>
        <!-- Attach student to team member -->
        <ion-modal backdropDismiss="false" trigger="open-new-customer-modal" (willDismiss)="onWillDismiss($event)">
          <ng-template>
            <ion-header>
              <ion-toolbar>
                <ion-buttons slot="start">
                  <ion-button (click)="cancel()">Cancel</ion-button>
                </ion-buttons>
                <ion-title>Attach student</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <app-attach-student [teamMember]="teamMember"></app-attach-student>
            </ion-content>
          </ng-template>
        </ion-modal>
      </ion-card-header>

      <ion-card-content>
        <app-my-students [teamMember] = "teamMember"></app-my-students>
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
  `,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    AttachStudentComponent,
    MyStudentsComponent
  ]
})
export class TeamMemberStudentsComponent {
  @Input() id: number | undefined;
  @Input() teamMember: TeamMember | undefined;
  @ViewChild(IonModal) modal!: IonModal;
  customerService = inject(CustomerService);

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
      console.log('Closed with confirm', ev.detail.data);
      let index = this.customerService.dbCustomers().indexOf(data);

      if (index !== -1) {
        const customer: Customer = this.customerService.dbCustomers()[index];
        customer.attachedTeacher = this.teamMember?.id;
        this.customerService.updateCustomer(customer);
      } else {
        console.log('Object not found in the array');
      }
    }
  }
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
    @if(teamMember){
      <ion-card>
        <ion-row>
          <ion-col size="4">
            <ion-avatar aria-hidden="true">
              <img  [src]="getProfilePic()" />
            </ion-avatar>
          </ion-col>
          <ion-col size="8">
            <ion-item lines="none">
              <h1 style="text-align: center">{{teamMember.name}} {{teamMember.surname}}</h1>
            </ion-item>
            <ion-item lines="none">
              <h4>{{teamMember.subject}}</h4>
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
    const index = this.teamMemberService.teamMembers().findIndex(item => item.id == this.id)
    if (index !== -1)
      this.teamMember = this.teamMemberService.teamMembers()[index];
  }

  deleteTeamMember(ev: any) {
    if (ev.detail.role === "confirm") {   
      this.teamMemberService.teamMembers.set(this.teamMemberService.teamMembers().filter(item => item.id !== this.teamMember?.id));
      this._location.back();
    }
    return
  }

  getProfilePic(){
    const index = this.loadFilesService.images.findIndex(image => image.name === this.teamMember?.profilePic);

    if (index !== -1){
      return this.loadFilesService.images[index].data;
    }else{
      return "https://ionicframework.com/docs/img/demos/avatar.svg"
    }
    
  }
}
