import { TeamMemberService } from 'src/app/servicies/team-member.service';
import { Activity } from 'src/app/models/activity.modal';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonCard, IonCardContent, IonSegment, IonSegmentButton, IonLabel, IonSegmentView, IonSegmentContent, IonItem, IonInput, IonRow, IonAlert, IonItemGroup } from '@ionic/angular/standalone';
import { ActivityService } from 'src/app/servicies/activity.service';
import { ErrorService } from 'src/app/servicies/error.service';

type ActivityType = 'lesson' | 'rental' | 'other';
type LessonFormat = 'private' | 'group';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
    IonItem,
    IonInput,
    IonItemGroup
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
        <form [formGroup] = "activityForm">

          <!-- Activity type -->
          <ion-segment formControlName="type" class="ion-margin-vertical">
            <ion-segment-button value="lesson">
              <ion-label>Lesson</ion-label>
            </ion-segment-button>
            <ion-segment-button value="rental">
              <ion-label>Rental</ion-label>
            </ion-segment-button>
            <ion-segment-button value="other">
              <ion-label>Other</ion-label>
            </ion-segment-button>
          </ion-segment>

          <!-- LESSON -->
          @if (activityForm.controls.type.value === 'lesson') {

              <!-- Lesson name -->
              <ion-segment formControlName="name" class="ion-margin-vertical">
                @for (a of activities; track $index) {
                  <ion-segment-button [value]="a.value">
                    <ion-label>{{ a.name }}</ion-label>
                  </ion-segment-button>
                }
              </ion-segment>

              <!-- Lesson format (private/group) -->
              <ion-segment formControlName="lessonFormat" class="ion-margin-vertical">
                <ion-segment-button value="private">
                  <ion-label>Private</ion-label>
                </ion-segment-button>
                <ion-segment-button value="group">
                  <ion-label>Group</ion-label>
                </ion-segment-button>
              </ion-segment>

              <!-- Duration (custom) -->
              <ion-item-group>
                <ion-item class="ion-margin-vertical">
                  <ion-input
                    type="number"
                    label="Hours"
                    labelPlacement="stacked"
                    formControlName="durationHours"
                    inputmode="numeric"
                    placeholder="e.g. 1">
                  </ion-input>
                </ion-item>
                <ion-item class="ion-margin-vertical">
                  <ion-input
                    type="number"
                    label="Minutes (0-59)"
                    labelPlacement="stacked"
                    formControlName="durationMinutes"
                    inputmode="numeric"
                    placeholder="e.g. 45">
                  </ion-input>
                </ion-item>
              </ion-item-group>          
             
              <!-- Team member -->
              <ion-label class="ion-margin">Team member</ion-label>

              @if (teamMembers().length === 0) {
                <br><br>
                <ion-label class="ion-margin">Add a team member or refresh the app.</ion-label>
              }

              @if (teamMembers().length > 0) {
                <ion-segment formControlName="teamMemberId" class="ion-margin-vertical">
                  @for (tm of teamMembers(); track tm.id) {
                    <ion-segment-button [value]="tm.id">
                      <ion-label>{{ tm.name }}</ion-label>
                    </ion-segment-button>
                  }
                </ion-segment>
              }
          }

          <!-- RENTAL -->
          @if (activityForm.controls.type.value === 'rental') {
            <ion-segment formControlName="name" class="ion-margin-vertical">
              @for (a of activities; track $index) {
                <ion-segment-button [value]="a.value">
                  <ion-label>{{ a.name }}</ion-label>
                </ion-segment-button>
              }
            </ion-segment>

            <ion-item-group>
              <ion-item class="ion-margin-vertical">
                <ion-input
                  type="number"
                  label="Hours"
                  labelPlacement="stacked"
                  formControlName="durationHours"
                  inputmode="numeric"
                  placeholder="e.g. 1">
                </ion-input>
              </ion-item>
              <ion-item class="ion-margin-vertical">
                <ion-input
                  type="number"
                  label="Minutes (0-59)"
                  labelPlacement="stacked"
                  formControlName="durationMinutes"
                  inputmode="numeric"
                  placeholder="e.g. 45">
                </ion-input>
              </ion-item>
            </ion-item-group>  
          }

          <!-- OTHER -->
          @if (activityForm.controls.type.value === 'other') {
            <ion-segment formControlName="name" class="ion-margin-vertical">
              @for (a of otherActivities; track $index) {
                <ion-segment-button [value]="a.value">
                  <ion-label>{{ a.name }}</ion-label>
                </ion-segment-button>
              }
            </ion-segment>

            <ion-item class="ion-margin-vertical">
              <ion-input [value]="activityForm.controls.amount.value" label="Amount:" formControlName="amount" fill="solid" labelPlacement="stacked" placeholder="Example: 1 day insurance"></ion-input>
            </ion-item>  
          }

          <ion-button expand="full" (click)="onSubmit()" [disabled]="submitDisabled()">
            Save
          </ion-button>
        </form>
      </ion-card-content>
    </ion-card>
  </ion-content>
  `,
  styleUrl: './new-activity.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewActivityComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private teamMemberService = inject(TeamMemberService);
  private activityService = inject(ActivityService);
  private errorService = inject(ErrorService);

  customerId = Number(this.route.snapshot.paramMap.get('id'));

  teamMembers = this.teamMemberService.getDbTeamMembers();

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
    name: new FormControl<string>('', Validators.required),
    type: new FormControl<ActivityType>('lesson', Validators.required),

    durationHours: new FormControl<number>(1, [Validators.required, Validators.min(0)]),
    durationMinutes: new FormControl<number>(0, [Validators.required, Validators.min(0), Validators.max(59)]),

    amount: new FormControl<string>(''),

    lessonFormat: new FormControl<LessonFormat>('private'),
    teamMemberId: new FormControl<number>(-1),
  });

  ngOnInit() {
    this.teamMemberService.getTeamMembers();

    // Optional: reset name when type changes
    this.activityForm.controls.type.valueChanges.subscribe(() => {
      this.resetForTypeChange();
    });
  }

  /**
  * Determines whether the "Save" button should be disabled based on the
  * current form state and activity-specific validation rules.
  *
  * Rules:
  * - The form must be valid.
  * - For lesson and rental: duration must be greater than 0 minutes.
  * - For lesson: a team member must be selected (teamMemberId !== -1).
  *
  * @returns True if the form cannot be submitted, otherwise false.
  */
  submitDisabled() {
    if (this.activityForm.invalid) return true;
    const type = this.activityForm.controls.type.value;

    // duration  must be > 0
    const totalMin = this.totalMinutes();
    if (totalMin <= 0 && type !== 'other') return true;

    // lesson requires team memeber
    if (type === 'lesson' && this.activityForm.controls.teamMemberId.value === -1) return true;

    return false
  };

  /**
  * Resets form fields that depend on the selected activity type.
  *
  * This prevents invalid combinations when switching between "lesson", "rental",
  * and "other" (e.g., keeping a team member selected when switching to rental).
  *
  * @returns void
  */
  private resetForTypeChange(): void {
    this.activityForm.controls.name.setValue('');
    this.activityForm.controls.durationHours.setValue(0);
    this.activityForm.controls.durationMinutes.setValue(0);
    this.activityForm.controls.teamMemberId.setValue(-1);
    this.activityForm.controls.lessonFormat.setValue('private');
  }

  /**
  * Calculates the total duration of the activity in minutes based on
  * the "durationHours" and "durationMinutes" form controls.
  *
  * @returns Total duration in minutes.
  */
  private totalMinutes(): number {
    const hours = Number(this.activityForm.controls.durationHours.value) || 0;
    const minutes = Number(this.activityForm.controls.durationMinutes.value) || 0;
    return hours * 60 + minutes;
  }

  /**
  * Formats a duration (in minutes) into a human-readable string.
  *
  * Examples:
  * - 25   -> "25 minutes"
  * - 60   -> "1 hour"
  * - 105  -> "1 hour 45 minutes"
  *
  * @param totalMinutes Total duration in minutes.
  * @returns A formatted duration string.
  */
  private formatDuration(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h === 0) return `${m} minutes`;
    if (m === 0) return `${h} hour${h === 1 ? '' : 's'}`;
    return `${h} hour${h === 1 ? '' : 's'} ${m} minutes`;
  }

  /**
  * Submits the form by creating a new Activity and persisting it via ActivityService.
  *
  * Flow:
  * - Validates form state using submitDisabled().
  * - Builds the activity "amount" string from the duration and (for lessons) the lesson format.
  * - Persists the activity.
  * - Refreshes the customer's activities list.
  * - Navigates back to the customer details page.
  *
  * @returns A promise that resolves when the operation completes.
  */
  async onSubmit(): Promise<void> {
    if (this.submitDisabled()) return;

    const type = this.activityForm.controls.type.value!;
    console.log('Submitting activity of type:', type);
    const totalMin = this.totalMinutes();
    const durationText = this.formatDuration(totalMin);

    const amount =
      type === 'lesson'
        ? `${durationText} ${this.activityForm.controls.lessonFormat.value}`
        : type === 'other'
          ? (this.activityForm.controls.amount.value ?? '')
          : durationText;

    console.log('Constructed amount:', amount);
    const activity: Activity = {
      customerId: Number(this.customerId),
      name: this.activityForm.controls.name.value!,
      type,
      amount,
      teamMemberId: Number(this.activityForm.controls.teamMemberId.value),
      durationMinutes: totalMin,
      lessonFormat: this.activityForm.controls.lessonFormat.value,
    };

    try {
      await this.activityService.addActivity(activity);
      await this.activityService.getActivityForCustomer(this.customerId);
      this.router.navigate(['../'], { relativeTo: this.route });
    } catch (error) {
      // hook into your alert/toast system if you want
      console.error('Error adding activity:', error);
      this.errorService.showError('Failed to add activity. Please try again.');
    }
  }
}
