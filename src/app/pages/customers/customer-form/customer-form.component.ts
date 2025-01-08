import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonButtons, IonCheckbox, IonCol, IonContent, IonDatetime, IonFab, IonFabButton, IonFabList, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, ModalController, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { SignPadComponent } from 'src/app/components/sign-pad/sign-pad.component';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/servicies/customer.service';
import { TermsOfServiceComponent } from '../../terms-of-service/terms-of-service.component';

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
              [readonly]="editForm">
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
              [readonly]="editForm">
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
              [readonly]="editForm">
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
              [readonly]="editForm">
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
              [readonly]="editForm"></ion-input>
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
              [readonly]="editForm">
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
              [readonly]="editForm">
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
              style="margin: auto; border: 1px solid; border-radius: 20px;"
            >
            </ion-datetime>
            </ion-col>
        </ion-row>
        <ion-row>
          <!---------------------------- Signature ---------------------------->
          <ion-col style="margin-top: 10px;">
            <ion-label>Signature*</ion-label>
            @if(!customerForDisplay){
              <app-sign-pad (signature)="handleSignature($event)"></app-sign-pad>
            }
            @if(customerForDisplay){
              <img [src]="this.customerForm.controls.signature.value" style="border: 1px solid">
            }
          </ion-col>
        </ion-row>
        @if(!editForm){
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
        @if(!editForm){
          <ion-button class="ion-margin-top" color="dark" expand="block" fill="outline" [disabled]="formValidation()" (click)="submit()" >Submit</ion-button>
        }
      </ion-grid>
      </form>
      @if(customerForDisplay){
        <ion-fab slot="fixed" vertical="top" horizontal="end">
          <ion-fab-button (click)="toggleEdit()">
            <ion-icon name="create-outline"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      }
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
    IonFab,
    IonFabButton,
    IonIcon,
    SignPadComponent,
    TermsOfServiceComponent,
  ]
})
export class CustomerFormComponent implements OnInit {
  
  @Input() customerForDisplay: Customer | undefined;
  // Confirmation that the customer was submited for the parent.
  @Output() customerSubmited  = new EventEmitter<boolean>();
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
  // Dependency injections
  private customerService = inject(CustomerService);

  // Variable to edit the customer form
  editForm = true;

  constructor() {
    // Set the current date for minimum date on the datepicker
    this.currentDate = new Date().toISOString();
  }

  ngOnInit(): void {
    // Initialize form values based on whether a customer is provided
    if (this.customerForDisplay == undefined) {
      this.customerForm.controls.departureDate.setValue(this.currentDate);
      this.editForm = false;
    }
    else
      this.populateForm();
  }

  // Populate the form with customer data
  private populateForm(): void {
    const customer: Customer = this.customerForDisplay!;
    if (customer) {
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
      // Disable the form controls when the form is populated
      this.customerForm.controls.departureDate.disable();
    }
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
 * Toggles the edit mode for the customer details form. When in edit mode, certain
 * form controls (activity, activityType, insurance, departureDate) are disabled to
 * prevent user modification. In view mode, these controls are enabled, allowing
 * users to update the customer details.
 */
  toggleEdit(): void {
    this.editForm = !this.editForm;

    if (this.editForm) {
      // Enable certain form controls in edit mode
      ['activity', 'activityType', 'insurance', 'departureDate'].forEach(controlName => {
        this.customerForm.get(controlName)?.disable();
      });
    } else {
      // Disable certain form controls in view mode and update the customer details
      ['activity', 'activityType', 'insurance', 'departureDate'].forEach(controlName => {
        this.customerForm.get(controlName)?.enable();
      });
    }
  }


  /**
 * Submits the form data, either adding a new customer or updating an existing one,
 * and dismisses the modal with the submitted data. If it's a new customer, it adds
 * the customer to the list, triggers a search update, and dismisses the modal.
 * If it's an existing customer, it updates the customer data, triggers a search update,
 * and closes the editing mode.
 */
  submit() {
    const customer: Customer = {
      name: this.customerForm.value.name!,
      surname: this.customerForm.value.surname!,
      homeAddress: this.customerForm.value.homeAddress!,
      hotel: this.customerForm.value.hotel!,
      hotelRoom: this.customerForm.value.hotelRoom!,
      email: this.customerForm.value.email!,
      phoneNumber: this.customerForm.value.phoneNumber!,
      departureDate: this.customerForm.value.departureDate?.split("T")[0]!,
      signature: this.customerForm.value.signature!,
      terms: this.customerForm.value.terms!,
      paid: this.customerForm.value.paid!,
    };

    // If customerForDisplay is undefined create a new customer
    if (!this.customerForDisplay) {
      // Add new customer to the database
      this.customerService.addCustomer(customer)
        .then(() => {
          console.log('New customer added successfully');
          // Send confirmation that the user was submited successfully.
          this.customerSubmited.emit(true);
        })
        .catch((error) => {
          console.error('Error adding new customer:', error);
          // Send confirmation that the user was not submited successfully.
          this.customerSubmited.emit(false);
        });
    } else {
      // Update the edited customer in the database
      customer.id = this.customerForDisplay.id;
      this.customerService.updateCustomer(customer)
        .then(() => {
          console.log('Customer updated successfully.');
          // Send confirmation that the user was submited successfully.
          this.customerSubmited.emit(true);
        })
        .catch((error) => {
          console.error('Error updating customer:', error);
          // Send confirmation that the user was not submited successfully.
          this.customerSubmited.emit(false);
        })
        .finally(() => {
          // Close the editing mode for an existing customer
          this.toggleEdit();
        });
    }
  }
}

