import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonCol, IonGrid, IonInput, IonItem, IonRow, IonSelect, IonSelectOption, ModalController } from '@ionic/angular/standalone';
import { TeamMember } from 'src/app/models/team-members.modal';
import { TeamMemberService } from 'src/app/servicies/team-member.service';
import { TeamProfilePhotoComponent } from "../team-profile-photo/team-profile-photo.component";

@Component({
  selector: 'app-team-member-form',
  standalone: true,
  template: `
  <app-team-profile-photo (profilePicture)="handleProfilePicture($event)"></app-team-profile-photo>
  <form [formGroup] = "teamMemberForm">
    <ion-grid>
      <ion-row>
        <!---------------------------- Name input ---------------------------->
        <ion-col>
          <ion-input 
            formControlName = "name"
            errorText = "Name is required"
            label = "Name*"
            label-placement = "floating"
            fill = "outline"
            placeholder = "Enter name">
          </ion-input>
        </ion-col>
        <!---------------------------- Surname input ---------------------------->
        <ion-col>
          <ion-input 
            formControlName = "surname"
            errorText = "Surname is required"
            label = "Surname*"
            label-placement = "floating"
            fill = "outline"
            placeholder = "Enter surname">
          </ion-input>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <!---------------------------- Activity input ---------------------------->
            <ion-select 
              formControlName ="subject" 
              errorText="Activity is required."
              label="Select activity*" 
              label-placement="floating">
              <ion-select-option value="Windsurfing">Windsurfing</ion-select-option>
              <ion-select-option value="Kitesurfing">Kitesurfing</ion-select-option>
              <ion-select-option value="Catamaran">Catamaran</ion-select-option>
              <ion-select-option value="Wingfoiling">Wingfoiling</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-button class="ion-margin-top" color="dark" expand="block" fill="outline" [disabled]="formValidation()" (click)="submit()" >Submit</ion-button>
    </ion-grid>
  </form>
  `,
  styleUrl: './team-member-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonButton,
    TeamProfilePhotoComponent
  ]
})
export class TeamMemberFormComponent {
  private teamMemberService = inject(TeamMemberService);
  private modalCtrl = inject(ModalController);

  private defaultProfilePicture = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  teamMemberForm = new FormGroup({
    profilePicture: new FormControl(''),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required)
  });

  formValidation() {
    return !this.teamMemberForm.valid;
  }

  submit() {
    const teamMember: TeamMember = {
      id: this.teamMemberService.teamMembers().length + 1,
      name: this.teamMemberForm.value.name!,
      surname: this.teamMemberForm.value.surname!,
      totalHoursTaught: 0,
      hoursTaughtThisMonth: 0,
      subject: [this.teamMemberForm.value.subject!],
      profilePic: (this.teamMemberForm.value.profilePicture?.length! > 0) ? this.teamMemberForm.value.profilePicture! : this.defaultProfilePicture
    }

    this.teamMemberService.teamMembers.set([...this.teamMemberService.teamMembers(), teamMember]);
    this.modalCtrl.dismiss(teamMember, 'confirm');
  }

  handleProfilePicture(photo: string) {
    this.teamMemberForm.controls.profilePicture.setValue(photo);
  }
}
