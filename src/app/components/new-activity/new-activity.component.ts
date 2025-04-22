import { TeamMemberService } from 'src/app/servicies/team-member.service';
import { Activity } from 'src/app/models/activity.modal';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonCard, IonCardContent, IonSegment, IonSegmentButton, IonLabel, IonSegmentView, IonSegmentContent, IonItem, IonInput, IonRow, IonAlert } from '@ionic/angular/standalone';
import { TeamMember } from 'src/app/models/team-members.modal';
import { ActivityService } from 'src/app/servicies/activity.service';

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
    IonSegmentView,
    IonSegmentContent,
    IonItem,
    IonInput,
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
        <!-- Activity type segment -->
        <ion-segment [value]="activityForm.controls.type.value" (ionChange)="onActivityTypeSegmentChange($event)" class="ion-margin-vertical">
          <ion-segment-button content-id="lesson" value="lesson">
            <ion-label>Lesson</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="rental" value="rental">
            <ion-label>Rental</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="other" value="other">
            <ion-label>Other</ion-label>
          </ion-segment-button>
        </ion-segment>
        
        <!-- Segment for lesson type activities -->
        @if(this.activityForm.controls.type.value === 'lesson'){
          <ion-segment [value]="activityForm.controls.name.value" class="ion-margin-vertical" (ionChange)="onActivityNameSegmentChange($event)">
            @for(activity of this.activities; track $index){
              <ion-segment-button value="{{activity.value}}">
                <ion-label expand="full">{{activity.name}}</ion-label>
              </ion-segment-button> 
            }
          </ion-segment>
          <ion-item class="ion-margin-vertical">
              <ion-input [value]="activityForm.controls.amount.value" label="Amount:" fill="soild" labelPlacement="stacked" placeholder="Example: 1 hour private" (ionChange)="onAmountInputChange($event)"></ion-input>
            </ion-item>
            <ion-label class="ion-margin">Team member</ion-label>
            @if(teamMembers.length === 0){
              <br>
              <br>
              <ion-label class="ion-margin">Add teamember or refresh the app.</ion-label>
            }
            @if(teamMembers.length > 0){
              <ion-segment [value]="activityForm.controls.teamMemberId.value" class="ion-margin-vertical" (ionChange)="onTeamMemberSegmentChange($event)">
              @for(teamMember of this.teamMembers; track $index){
                <ion-segment-button value="{{teamMember.id}}">
                  <ion-label>{{teamMember.name}}</ion-label>
                </ion-segment-button>
              }
              </ion-segment>
            }
          }
        @if(this.activityForm.controls.type.value === 'rental'){
          <ion-segment [value]="activityForm.controls.name.value" class="ion-margin-vertical" (ionChange)="onActivityNameSegmentChange($event)">
              @for(activity of this.activities; track $index){
                <ion-segment-button value="{{activity.value}}">
                  <ion-label>{{activity.name}}</ion-label>
                </ion-segment-button> 
              }
            </ion-segment>
            <ion-item class="ion-margin-vertical">
              <ion-input [value]="activityForm.controls.amount.value" label="Amount:" fill="soild" labelPlacement="stacked" placeholder="Example: 1 day" (ionChange)="onAmountInputChange($event)"></ion-input>
            </ion-item>
        }

        @if(this.activityForm.controls.type.value === 'other'){
          <ion-segment [value]="activityForm.controls.name.value" class="ion-margin-vertical" (ionChange)="onActivityNameSegmentChange($event)">
              @for(otherActivity of this.otherActivities; track $index){
                <ion-segment-button value="{{otherActivity.value}}">
                  <ion-label>{{otherActivity.name}}</ion-label>
                </ion-segment-button>
              }
            </ion-segment>
            <ion-item class="ion-margin-vertical">
              <ion-input [value]="activityForm.controls.amount.value" label="Amount:" fill="soild" labelPlacement="stacked" placeholder="Example: 1 day insurance" (ionChange)="onAmountInputChange($event)"></ion-input>
            </ion-item>
        }        
        <ion-button expand="full" (click)="onSubmit()">Save</ion-button>
      </ion-card-content>
    </ion-card>
  </ion-content>
  `,
  styleUrl: './new-activity.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewActivityComponent implements OnInit {
  customerId: number;

  teamMembers: TeamMember[];

  activities = [
    { name: 'Kitesurfing', value: 'kitesurfing' },
    { name: 'Windsurfing', value: 'windsurfing' },
    { name: 'Wingfoiling', value: 'wingfoil' },
    { name: 'SUP', value: 'sup' },
    { name: 'Catamarn', value: 'catamaran' },
  ]

  otherActivities = [
    { name: 'Rescue', value: 'rescue' },
    { name: 'Insurance', value: 'insurance' },
    { name: 'Other', value: 'other' },
  ];

  activityForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('lesson', Validators.required),
    amount: new FormControl('', Validators.required),
    teamMemberId: new FormControl(-1),
  });

  constructor(private route: ActivatedRoute, private teamMemberService: TeamMemberService, private activityService: ActivityService, private router: Router) {
    // Extract the customer ID from the URL. Url example: /1/new-activity
    this.customerId = Number(this.route.snapshot.url.join('/').split('/')[0]);
    this.teamMembers = this.teamMemberService.dbTeamMembers();
  }

  ngOnInit() {
    console.log('Current ID:', this.customerId);
  }

  // Handle the activity type segment change event
  onActivityTypeSegmentChange(event: CustomEvent) {
    this.activityForm.controls.type.setValue(event.detail.value);
    this.restActivityForm();
  }

  // Handle the activity name segment change event
  onActivityNameSegmentChange(event: CustomEvent) {
    this.activityForm.controls.name.setValue(event.detail.value);
  }

  // Handle the team member segment change event
  onTeamMemberSegmentChange(event: CustomEvent) {
    this.activityForm.controls.teamMemberId.setValue(Number(event.detail.value));
  }

  // Handle the amount input change event
  onAmountInputChange(event: CustomEvent) {
    this.activityForm.controls.amount.setValue(event.detail.value);
  }

  // Reset the activity form fields
  restActivityForm() {
    this.activityForm.controls.name.setValue('');
    this.activityForm.controls.amount.setValue('');
    this.activityForm.controls.teamMemberId.setValue(-1);
  }

  onSubmit() {
    if (!this.activityForm.valid) return;
    if (this.activityForm.controls.type.value === 'lesson' && this.activityForm.controls.teamMemberId.value == -1) return;

    const activity: Activity = {
      customerId: Number(this.customerId),
      name: this.activityForm.controls.name.value!,
      type: this.activityForm.controls.type.value!,
      amount: this.activityForm.controls.amount.value!,
      teamMemberId: Number(this.activityForm.controls.teamMemberId.value),
    }

    this.activityService.addActivity(activity).then(() => {
      this.restActivityForm();
      this.activityService.getActivityForCustomer(this.customerId);
      this.router.navigate(['../'], { relativeTo: this.route });
    }).catch((error) => {
      console.error('Error adding activity:', error);
    });
  }
}
