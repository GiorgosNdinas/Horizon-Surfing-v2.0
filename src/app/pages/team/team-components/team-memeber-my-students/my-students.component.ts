import { OverlayEventDetail } from '@ionic/core/components';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild, computed, inject } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonModal, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Customer } from 'src/app/models/customer.model';
import { TeamMember } from 'src/app/models/team-members.modal';
import { CustomerService } from 'src/app/servicies/customer.service';
import { LessonsService } from 'src/app/servicies/lessons.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Lesson } from 'src/app/models/lesson.model';

@Component({
  selector: 'app-lesson-modal',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    FormsModule,
    ReactiveFormsModule,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="cancel()">Cancel</ion-button>
        </ion-buttons>
        <ion-title>Welcome</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="create()" [strong]="true" [disabled]="!this.lessonForm.valid">Create</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form [formGroup] = "lessonForm">
        <ion-list>
          <ion-item>
            <ion-select
              formControlName = "lessonType"
              label="Lesson type*" 
              label-placement="fixed" 
              placeholder="Select type"
            >
              <ion-select-option value="Private">Private</ion-select-option>
              <ion-select-option value="Group">Group</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-select
              formControlName = "lessonHours"
              label="Hours*" 
              label-placement="fixed" 
              placeholder="Select hour"
            >
              <ion-select-option value="1.0">1:00</ion-select-option>
              <ion-select-option value="1.5">1:30</ion-select-option>
              <ion-select-option value="2.0">2:00</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>
      </form>
    </ion-content>
  `
})
export class LessonModalComponent {
  lessonService = inject(LessonsService);
  modalController = inject(ModalController);

  lessonForm = new FormGroup({
    lessonType: new FormControl('', Validators.required),
    lessonHours: new FormControl('', Validators.required)
  });
  // Modal functions
  cancel() {
    console.log('Here')
    return this.modalController.dismiss(null, 'cancel');
  }

  create() {
    const lessonDate = new Date().toISOString().split("T")[0]!;
    const newLesson: Lesson = {
      id: this.lessonService.getLessons().length + 1,
      lessonDate: lessonDate,
      lessonType: this.lessonForm.value.lessonType!,
      lessonHours: this.lessonForm.value.lessonHours!
    };
    return this.modalController.dismiss(newLesson, 'create');
  }
}

@Component({
  selector: 'app-my-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonSearchbar,
    IonList,
    IonGrid,
    IonRow,
    IonCol,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonButton,
  ],
  template: `
    <ion-searchbar [debounce]="500" placeholder="Search Student" (ionInput)="handleSearchInput($event)"></ion-searchbar>
    <ion-accordion-group>
      @for(student of studentsForDisplay(); track $index){
        <ion-accordion [value]="$index">
          <ion-item slot="header" color="light">
            <ion-label>{{student.name}}</ion-label>
            <ion-label>{{student.surname}}</ion-label>
            <ion-label>{{student.activity}}</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content" style="border: 1px solid; border-top:none;">
            <ion-grid>
              @for(lesson of this.lessonService.getLessonsForTeacher(teamMember?.id!, student.id!); track $index){
                <ion-row>
                  <ion-col size="6">{{ lesson.lessonDate }}</ion-col>
                  <ion-col size="4">{{ lesson.lessonType }}</ion-col>
                  <ion-col size="2">{{ lesson.lessonHours }}</ion-col>
                </ion-row>
              }
              <ion-row class="ion-padding-top">
                <ion-col size="12">
                  <ion-button (click)="openModal(student.id!)"  expand="block">Add lesson</ion-button>
              </ion-col>
              </ion-row>
            </ion-grid>            
          </div>
        </ion-accordion>
      }
    </ion-accordion-group>
  `,
  styleUrl: './my-students.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyStudentsComponent {
  showId(id: number) {
    console.log('Button pressed with id: ', id);
  }
  @Input() teamMember: TeamMember | undefined;
  @ViewChild(IonModal) modal!: IonModal;

  customerService = inject(CustomerService);
  lessonService = inject(LessonsService);
  modalController = inject(ModalController);

  studentsForDisplay = computed<Customer[]>(() => {
    return this.customerService.dbSearchCustomers().filter(customer => {
      return customer.activityType === "Lesson" && customer.attachedTeacher == this.teamMember?.id;
    });
  });

  // Search input habdler
  handleSearchInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.customerService.dbSearchCustomers.set(this.customerService.dbCustomers().filter((d) => d.name.toLowerCase().indexOf(query) > -1));
  }

  async openModal(studentId: number) {
    const modal = await this.modalController.create({
      component: LessonModalComponent,
      id: String(studentId)
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'create') {
      data.teacherId = this.teamMember?.id;
      data.customerId = studentId;
      this.lessonService.addNewLesson(data);
    }
  }
}

