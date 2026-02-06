import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, Signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonButtons, IonCheckbox, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonInput, IonLabel, IonModal, IonRow, IonTitle, IonToolbar, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { SignPadComponent } from 'src/app/components/sign-pad/sign-pad.component';
import { Customer } from 'src/app/models/customer.model';
import { TermsOfServiceComponent } from '../../../../components/terms-of-service/terms-of-service.component';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  template: `
  <ion-card class="ion-margin-bottom">
    <ion-card-content>
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
              placeholder="Enter name"
              [readonly]="!editableForm()">
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
              placeholder="Enter surname"
              [readonly]="!editableForm()">
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
              placeholder="Enter home address"
              [readonly]="!editableForm()">
            </ion-input>
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
              placeholder="Hotel"
              [readonly]="!editableForm()">
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
              placeholder="Room number"
              [readonly]="!editableForm()"></ion-input>
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
              label-placement="floating" fill="outline" type="email" placeholder="Enter E-mail"
              [readonly]="!editableForm()">
            </ion-input>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <!---------------------------- Phone number input ---------------------------->
            <ion-input 
              formControlName ="phoneNumber" 
              label="Phone number*" 
              errorText="Phone is required" 
              label-placement="floating" fill="outline" placeholder="Enter Phone number"
              [readonly]="!editableForm()">
            </ion-input>
          </ion-col>
        </ion-row>
        <ion-row>
          <!---------------------------- Departure date picker ---------------------------->
          <ion-col style="text-align: center;">
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
              [disabled]="!editableForm()"
              style="margin: auto; border: 1px solid; border-radius: 20px;"
            >
            </ion-datetime>
            </ion-col>
        </ion-row>
        <ion-row>
          <!---------------------------- Signature ---------------------------->
          <ion-col style="margin-top: 10px;">
            <ion-label>Signature*</ion-label>
            @if(!customer){
              <app-sign-pad (signature)="handleSignature($event)"></app-sign-pad>
            }
            @if(customer){
              <img [src]="this.customerForm.controls.signature.value" style="border: 1px solid">
            }
          </ion-col>
        </ion-row>
        @if(editableForm()){
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
                      <ion-button (click)="modalConfirm()" [strong]="true">Confirm</ion-button>
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
        }
        @if(editableForm()){
          <ion-button class="ion-margin-top" color="dark" expand="block" fill="outline" [disabled]="formValidation()" (click)="submit()" >Submit</ion-button>
        }
      </ion-grid>
      </form>
    <br>
    </ion-card-content>
  </ion-card>
  `,
  styleUrl: './customer-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
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
    SignPadComponent,
    TermsOfServiceComponent,
  ]
})
export class CustomerFormComponent implements OnChanges {
  // Input customer for edit mode, undefined for create mode
  @Input() customer: Customer | undefined;

  // Signal to determine if the form is editable or read-only
  @Input() editableForm!: Signal<boolean>;

  // Event emitter to send the submitted customer data to the parent component
  @Output() customerSubmitted = new EventEmitter<Customer>();

  @ViewChild(IonModal) modal!: IonModal;

  // Form declaration using Angular Reactive Forms
  customerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    homeAddress: new FormControl('', Validators.required),
    hotel: new FormControl('', Validators.required),
    hotelRoom: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    departureDate: new FormControl('', Validators.required),
    signature: new FormControl('', Validators.required),
    terms: new FormControl(0, Validators.required),
    paid: new FormControl(0)
  });

  // Variable needed to set the minimum date on the datepicker.
  currentDate: string;

  constructor() {
    // Set the current date in ISO format for the date picker minimum value
    this.currentDate = new Date().toISOString();
  }

  ngOnChanges(): void {
    // Initialize form values based on whether a customer is provided
    if (this.customer)
      this.populateForm(this.customer);
    else {
      this.customerForm.reset();
      this.customerForm.controls.departureDate.setValue(this.currentDate);
    }

    // Manage the enable/disable state of the departure date control
    const departureDateControl = this.customerForm.controls.departureDate;
    // Rule to enable the departure date control
    const enableDepartureDate = !this.customer && this.editableForm();

    // Enable or disable the departure date control based on editability
    if (enableDepartureDate)
      departureDateControl.enable({ emitEvent: false });
    else
      departureDateControl.disable({ emitEvent: false });
  }

  // Populate the form with customer data
  private populateForm(customer: Customer): void {
    const {
      name = '',
      surname = '',
      homeAddress = '',
      hotel = '',
      hotelRoom = null,
      email = '',
      phoneNumber = '',
      departureDate = '',
      signature = '',
      terms = 0,
      paid = 0,
    } = customer;

    this.customerForm.setValue({
      name,
      surname,
      homeAddress,
      hotel,
      hotelRoom,
      email,
      phoneNumber,
      departureDate,
      signature,
      terms,
      paid,
    });
  }

  // Change the value of the 'terms' form control on every checkbox click
  termsCheckboxClick(e: any) {
    this.customerForm.controls.terms.setValue(e.detail.checked);
  }

  handleSignature(event: any) {
    this.customerForm.controls.signature.setValue(event);
  }

  formValidation() {
    return !this.customerForm.valid || !this.customerForm.value.terms;
  }

  // Close the term and services modal with a 'confirm' action
  modalConfirm() {
    this.modal.dismiss('confirm');
  }

  /**
   * Submits the customer form data by emitting the customerSubmitted event with the form values.
   */
  submit() {

    const raw = this.customerForm.getRawValue(); // includes disabled controls

    const customer: Customer = {
      name: raw.name!,
      surname: raw.surname!,
      homeAddress: raw.homeAddress!,
      hotel: raw.hotel!,
      hotelRoom: raw.hotelRoom!,
      email: raw.email!,
      phoneNumber: raw.phoneNumber!,
      departureDate: raw.departureDate!.split("T")[0]!,
      signature: raw.signature!,
      terms: raw.terms!,
      paid: raw.paid!,
    };

    this.customerSubmitted.emit(customer);
  }
}

