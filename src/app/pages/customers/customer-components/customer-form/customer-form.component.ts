import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonButtons, IonCheckbox, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Customer } from 'src/app/models/customer.model';
import { TermsOfServiceComponent } from "../../../terms-of-service/terms-of-service.component";
import { CustomerService } from 'src/app/servicies/customer.service';

@Component({
    selector: 'app-customer-form',
    standalone: true,
    template: `
  <form [formGroup] = "customerForm">
    <ion-grid>
      <ion-row>
        <ion-col>
          <!---------------------------- Name input ---------------------------->
          <ion-input 
            formControlName ="name"
            errorText="Name is required."
            label="Name*" 
            label-placement="floating" 
            fill="outline" 
            placeholder="Enter name">
          </ion-input>
        </ion-col>
        <ion-col>
          <!---------------------------- Surname input ---------------------------->
          <ion-input
            formControlName ="surname" 
            errorText="Surname is required." 
            label="Surname*" 
            label-placement="floating" 
            fill="outline" 
            placeholder="Enter surname">
          </ion-input>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <!---------------------------- Home address input ---------------------------->
          <ion-input
            formControlName ="homeAddress" 
            errorText="Home address is required." 
            label="Home address*" 
            label-placement="floating" 
            fill="outline" 
            placeholder="Enter home address"></ion-input>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col  size="8">
          <!---------------------------- Hotel input ---------------------------->
          <ion-input 
            formControlName ="hotel" 
            errorText="Hotel is required."
            label="Hotel*" 
            label-placement="floating" 
            fill="outline" 
            placeholder="Hotel">
          </ion-input>
        </ion-col>
        <ion-col >
          <!---------------------------- Room number input ---------------------------->
          <ion-input 
            formControlName ="hotelRoom" 
            errorText="Room number is required."
            label="Room number*" 
            label-placement="floating" 
            fill="outline" 
            type="number" 
            placeholder="Room number"></ion-input>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <!---------------------------- E-mail input ---------------------------->
          <ion-input 
            formControlName ="email" 
            label="E-mail*" 
            errorText="Invalid email"
            email 
            label-placement="floating" fill="outline" type="email" placeholder="Enter E-mail"></ion-input>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <!---------------------------- Activity input ---------------------------->
            <ion-select 
              formControlName ="activity" 
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
        <ion-col>
          <ion-item>
            <!---------------------------- Activity type input ---------------------------->
            <ion-select 
              formControlName ="activityType" 
              errorText="Activity type is required."
              label="Activity type*" 
              label-placement="floating">
              <ion-select-option value="Lesson">Lesson</ion-select-option>
              <ion-select-option value="Rental">Rental</ion-select-option>
              <ion-select-option value="Other">Other</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-col>
        <ion-col>
          <ion-item>
            <!---------------------------- Insurance input ---------------------------->
            <ion-select 
              formControlName ="insurance" 
              errorText="Insurance is required."
              label="Select insurance*" 
              label-placement="floating">
              <ion-select-option value="1 week">1 week</ion-select-option>
              <ion-select-option value="2 weeks">2 weeks</ion-select-option>
              <ion-select-option value="No">No</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <!---------------------------- Departure date picker ---------------------------->
        <ion-col style="text-align: center; margin">
          <ion-label>Departure date*</ion-label>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          <ion-datetime 
            presentation="date"
            required="true"
            formControlName ="departureDate"
            [min]="this.currentDate"
            style="margin: auto; border: 1px solid; border-radius: 20px;"
          >
          </ion-datetime>
          </ion-col>
      </ion-row>
      <ion-row>
        <!---------------------------- Terms check ---------------------------->
        <ion-col style="margin-top: 10px; margin-left: 10px;">
          <ion-checkbox 
          required="true"
          formControlName = "terms"
          (ionChange)="termsCheckboxClick($event)"
          labelPlacement="end"
          style="white-space: normal;">
          <ion-label style="white-space: break-spaces;">By checking, you agree to Horizon's surfing center <a id="open-modal" style="text-decoration: none;">Terms of Service</a>.</ion-label>
          <ion-modal trigger="open-modal">
            <ng-template>
              <ion-header>
                <ion-toolbar>
                  <ion-title>Terms of service</ion-title>
                  <ion-buttons slot="end">
                    <ion-button (click)="confirm()" [strong]="true">Confirm</ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content>
                <app-terms-of-service></app-terms-of-service>
              </ion-content>
            </ng-template>
          </ion-modal>
        </ion-checkbox>
        </ion-col>
      </ion-row>
        <ion-button class="ion-margin-top" color="dark" expand="block" fill="outline" [disabled]="formValidation()" (click)="submit()" >Submit</ion-button>
    </ion-grid>
  </form>
  `,
    styleUrl: './customer-form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonGrid,
        IonRow,
        IonCol,
        IonInput,
        IonItem,
        IonSelect,
        IonSelectOption,
        IonLabel,
        IonDatetime,
        IonCheckbox,
        IonModal,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonContent,
        TermsOfServiceComponent
    ]
})
export class CustomerFormComponent implements OnInit {
  @Input() customer: Customer | undefined;
  @ViewChild(IonModal) modal!: IonModal;

  // Form declaration using Angular Reactive Forms
  customerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    homeAddress: new FormControl('', Validators.required),
    hotel: new FormControl('', Validators.required),
    hotelRoom: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    activity: new FormControl('', Validators.required),
    activityType: new FormControl('', Validators.required),
    insurance: new FormControl('', Validators.required),
    departureDate: new FormControl('', Validators.required),
    terms: new FormControl(false, Validators.required),
    paid: new FormControl(false)
  });

  // Variable needed to set the minimum date on the datepicker.
  currentDate: string;

  // Dependency injections
  private modalCtrl = inject(ModalController);
  private customerService = inject(CustomerService);

  constructor(){
    // Set the current date for minimum date on the datepicker
    this.currentDate = new Date().toISOString();
  }

  ngOnInit(): void {
    // Initialize form values based on whether a customer is provided
    if(this.customer == undefined)
      this.customerForm.controls.departureDate.setValue(this.currentDate);
    else
      this.populateForm();
  }

  // Populate the form with customer data
  private populateForm(): void {
    const customer: Customer = this.customer!;
    if (customer) {
      const {
        name = '',
        surname = '',
        homeAddress = '',
        hotel = '',
        hotelRoom = null,
        email = '',
        activity = '',
        activityType = '',
        insurance = '',
        departureDate = '',
        terms = false,
        paid = false,
      } = customer;

      this.customerForm.setValue({
        name,
        surname,
        homeAddress,
        hotel,
        hotelRoom,
        email,
        activity,
        activityType,
        insurance,
        departureDate,
        terms,
        paid,
      });
    }
  }

  // Change the value of the 'terms' form control on every checkbox click
  termsCheckboxClick(e: any) {
    this.customerForm.controls.terms.setValue(e.detail.checked);
  }

  formValidation(){
    return !this.customerForm.valid || !this.customerForm.value.terms
  }

  // Close the term and services modal with a 'confirm' action
  confirm() {
    this.modal.dismiss('confirm');
  }

  // Submit the form and dismiss the modal with the submitted data
  submit(){
    const newCustomer = {
      // TODO: Change the id assign to the backend
      id: this.customerService.customers().length + 1,
      ...this.customerForm.value,
      departureDate: this.customerForm.value.departureDate?.split("T")[0],
      hotelRoom: Number(this.customerForm.value.hotelRoom),
    };
    return this.modalCtrl.dismiss(newCustomer, 'confirm');
  } 
 }

