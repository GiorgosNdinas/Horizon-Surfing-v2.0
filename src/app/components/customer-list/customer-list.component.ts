import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Input, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonCol, IonGrid, IonIcon, IonList, IonRow, IonSearchbar } from '@ionic/angular/standalone';
import { Customer } from 'src/app/models/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    IonSearchbar,
    IonList,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    RouterLink
  ],
  template: `
  <ion-searchbar 
    [debounce]="500" 
    placeholder="Search customer by Surname"
    style="padding-top: 20px"></ion-searchbar>
  <ion-list>
    <ion-grid>
      <ion-row class="ion-align-items-start">
          <ion-col size="auto">#</ion-col>
          <ion-col>Name</ion-col>
          <ion-col>Surname</ion-col>
          <ion-col>Departure</ion-col>
          <ion-col size="2">Paid</ion-col>
      </ion-row>
      @for(customer of this.customersForSearch(); track $index){
        <ion-row class="ion-align-items-start" [routerLink]="[customer.id]">
          <ion-col size="auto">{{$index + 1}}</ion-col>
          <ion-col>{{customer.name}}</ion-col>
          <ion-col>{{customer.surname}}</ion-col>
          <ion-col>{{customer.departureDate!.split("-").reverse().join("-")}}</ion-col>
          @if(customer.paid){
            <ion-col size="2"><ion-icon name="checkmark-outline"></ion-icon></ion-col>
          }
          @if(!customer.paid){
            <ion-col size="2"><ion-icon name="close-outline"></ion-icon></ion-col>
          }
        </ion-row>
      }
    </ion-grid>
  </ion-list>
  `,
  styleUrl: './customer-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerListComponent {

  @Input() customers!: Signal<Customer[]>;

  search = signal('');

  customersForSearch = computed(() => {
    const query = this.search().toLowerCase();

    return this.customers().filter(d =>
      d.surname.toLowerCase().includes(query)
    );
  });

  handleSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
  }
}
