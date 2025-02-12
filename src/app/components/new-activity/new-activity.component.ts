import { Activity } from 'src/app/models/activity.modal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonCard, IonCardContent, IonSegment, IonSegmentButton, IonLabel, IonSegmentView, IonSegmentContent, IonItem, IonInput, IonRow, IonAlert } from '@ionic/angular/standalone';

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
        <!--******************* Segment view *******************-->
        <ion-segment-view>
          <!--******************* Lesson segment view  *******************-->
          <ion-segment-content id="lesson">
            <ion-segment [value]="activityForm.controls.name.value" class="ion-margin-vertical" (ionChange)="onActivityNameSegmentChange($event)">
            @for(activity of this.activities; track $index){
              <ion-segment-button value="{{activity.value}}">
                <ion-label>{{activity.name}}</ion-label>
              </ion-segment-button> 
            }
            </ion-segment>
            <ion-item class="ion-margin-vertical">
              <ion-input [value]="activityForm.controls.amount.value" label="Amount:" fill="soild" labelPlacement="stacked" placeholder="Example: 1 hour private" (ionChange)="onAmountInputChange($event)"></ion-input>
            </ion-item>
            <!--******************* Segment team memeber *******************-->
            <ion-label class="ion-margin">Team member</ion-label>
            <ion-segment [value]="activityForm.controls.teamMemberId.value" class="ion-margin-vertical" (ionChange)="onTeamMemberSegmentChange($event)">
              @for(teamMember of this.teamMembers; track $index){
                <ion-segment-button value="{{teamMember.id}}">
                  <ion-label>{{teamMember.name}}</ion-label>
                </ion-segment-button>
              }
            </ion-segment> 
          </ion-segment-content>
          <!--******************* Rental segment view  *******************-->
          <ion-segment-content id="rental">
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
          </ion-segment-content>
          <!--******************* Other segment view  *******************-->
          <ion-segment-content id="other">
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
          </ion-segment-content>
        </ion-segment-view>
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

  teamMembers = [
    { name: 'John Doe', id: 1 },
    { name: 'Jane Doe', id: 2 },
    { name: 'John Smith', id: 3 },
    { name: 'Jane Smith', id: 4 },
    { name: 'John Johnson', id: 5 },
  ]

  activityForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('lesson', Validators.required),
    amount: new FormControl('', Validators.required),
    teamMemberId: new FormControl(-1),
  });

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    // Extract the customer ID from the URL. Url example: /1/new-activity
    this.customerId = Number(this.route.snapshot.url.join('/').split('/')[0]);
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

  onSubmit(){
    if(!this.activityForm.valid){
      console.log('Invalid form');
      return;
    }
    const activity: Activity ={
      customerId: Number(this.customerId),
      name: this.activityForm.controls.name.value!,
      type: this.activityForm.controls.type.value!,
      amount: this.activityForm.controls.amount.value!,
      teamMemberId: Number(this.activityForm.controls.teamMemberId.value),
    }
    console.log('Activity:', activity);
  }
}
