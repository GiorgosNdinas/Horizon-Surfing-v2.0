import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, computed, inject } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonCol, IonGrid, IonItem, IonLabel, IonList, IonRow, IonSearchbar, ModalController } from '@ionic/angular/standalone';
import { Customer } from 'src/app/models/customer.model';
import { TeamMember } from 'src/app/models/team-members.modal';
import { CustomerService } from 'src/app/servicies/customer.service';

@Component({
  selector: 'app-my-students',
  standalone: true,
  imports: [
    CommonModule,
    IonSearchbar,
    IonList,
    IonGrid,
    IonRow,
    IonCol,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel

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
          <div class="ion-padding" slot="content">Id {{student.id}}, private, 1hr</div>
        </ion-accordion>
      }
    </ion-accordion-group>
  `,
  styleUrl: './my-students.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyStudentsComponent { 
  @Input() teamMember: TeamMember | undefined;
  customerService = inject(CustomerService);
  modalController = inject(ModalController);

  studentsForDisplay = computed<Customer[]>(() => {
    return this.customerService.searchCustomers().filter(customer => {
      // TODO: Find a solution for a teacher that has multiple subjects
        return customer.activityType === "Lesson" && customer.attachedTeacher == this.teamMember?.id;
    });
  });
  // Search input habdler
  handleSearchInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.customerService.searchCustomers.set(this.customerService.customers().filter((d) => d.name.toLowerCase().indexOf(query) > -1));
  }
}
