import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { IonSearchbar, IonList, IonGrid, IonRow, IonCol, IonItem, IonButton, IonIcon, IonAlert, AlertController, ModalController } from '@ionic/angular/standalone';
import { Customer } from 'src/app/models/customer.model';
import { TeamMember } from 'src/app/models/team-members.modal';
import { CustomerService } from 'src/app/servicies/customer.service';

@Component({
  selector: 'app-attach-student',
  standalone: true,
  imports: [
    IonSearchbar,
    IonList,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonAlert
  ],
  template: `
    <ion-searchbar [debounce]="500" placeholder="Search Student" (ionInput)="handleSearchInput($event)"></ion-searchbar>
    <ion-list>
      <ion-grid>
        @for(student of studentsForDisplay(); track $index){
          <ion-row>
            <ion-col size="3">{{student.name}}</ion-col>
            <ion-col size="3">{{student.surname}}</ion-col>
            <ion-col size="1">
              <ion-button [id]="student.id" fill="clear">
              <ion-icon name="attach-outline"></ion-icon>  
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-alert
            [trigger]="student.id"
            header="Are you sure you want to attach this student?"
            [buttons]="alertButtons"
            (didDismiss)="attachStudentToTeamMember($event, student)"
          ></ion-alert>
        }
      </ion-grid>
    </ion-list>
  `,
  styleUrl: './attach-student.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachStudentComponent {
  @Input() teamMember: TeamMember | undefined;
  customerService = inject(CustomerService);
  modalController = inject(ModalController);

  studentsForDisplay = computed<Customer[]>(() => {
    return this.customerService.dbSearchCustomers().filter(customer => {
      // return customer.activity === this.teamMember?.subject && customer.activityType === "Lesson";        
    });
  });

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

  // Search input habdler
  handleSearchInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.customerService.dbSearchCustomers.set(this.customerService.dbCustomers().filter((d) => d.name.toLowerCase().indexOf(query) > -1));
  }

  attachStudentToTeamMember(ev: any, student: Customer) {
    if (ev.detail.role === "confirm") {
      return this.modalController.dismiss(student, 'confirm');      
    }
    return
  }
}
