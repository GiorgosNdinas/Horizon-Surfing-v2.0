import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonImg, IonItem, IonLabel } from '@ionic/angular/standalone';
import { CustomerService } from 'src/app/servicies/customer.service';
import { LoadFilesService } from 'src/app/servicies/load-files.service';
import { TeamMemberService } from 'src/app/servicies/team-member.service';

@Component({
  selector: 'app-home',
  template: `
    <ion-content [fullscreen]="true">
      <div id="container">
        <ion-img src="./assets/Logo.png"></ion-img>
        <ion-item lines="none" color="none">
          <ion-label>
            <h1>Welcome to Horizon surfing</h1>
          </ion-label>
        </ion-item>
        <div class="buttons">
          <ion-button expand="block" shape="round" color="dark" (click)="navigateToPage('customers')"
            routerDirection="forward">Customers</ion-button>
          <ion-button expand="block" shape="round" color="warning" (click)="navigateToPage('team')" fill="outline"
            routerDirection="forward">Team</ion-button>
        </div>
      </div>
  </ion-content>
`,
  styleUrl: './home.page.scss',
  standalone: true,
  imports: [IonContent, IonImg, IonItem, IonLabel, IonButton],
})
export class HomePage {
  // Router injection

  constructor(private router: Router, private customerService: CustomerService,private teamMemberService: TeamMemberService, private loadFilesService: LoadFilesService){
    this.customerService.getCustomers();
    this.teamMemberService.getTeamMembers();
    this.loadFilesService.loadFiles();
  }

  customers = this.customerService.dbCustomers();

  // Function to navigate depending on wich button is pressed
  navigateToPage(page: string) {
    console.log(page);
    this.router.navigate([`/${page}`]);
  }
}
