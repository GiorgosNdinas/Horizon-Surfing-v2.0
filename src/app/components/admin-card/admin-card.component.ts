import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { IonCard, IonRow, IonCol, IonAvatar, IonItem, AlertController, ToastController } from "@ionic/angular/standalone";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-card',
  standalone: true,
  imports: [IonCard, IonRow, IonCol, IonAvatar, IonItem],
  template: `
  <ion-card (click)="openAdminLogin()">
    <ion-row>
      <ion-col size="3">
        <ion-avatar aria-hidden="true">
          <img src="./assets/Logo.png" />
        </ion-avatar>
      </ion-col>
      <ion-col size="9">
        <ion-item lines="none">
          <h1>Admin</h1>
        </ion-item>
        <ion-item lines="none">
          <h2>Login</h2>
        </ion-item>
      </ion-col>
    </ion-row>
  </ion-card>
  `,
  styleUrl: './admin-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCardComponent {
  @Output() adminLoginStatus = new EventEmitter<boolean>();

  adminPassword = environment.adminPassword;

  constructor(private alertController: AlertController, private toastController: ToastController) {}

  async openAdminLogin() {
    const alert = await this.alertController.create({
      header: 'Admin Login',
      inputs: [
        {
          name: 'username',
          type: 'text',
          value: 'admin',
          placeholder: 'Username',
          attributes: { disabled: true}
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.adminLoginStatus.emit(false);
            return true;
          }
        },
        {
          text: 'Login',
          handler: async (data) => {
            if (this.validateAminLogin(data?.password)) {
              this.adminLoginStatus.emit(true);
              return true;
            }

            const toast = await this.toastController.create({
              message: 'Invalid admin password. Please try again.',
              duration: 2000,
              color: 'danger'
            });
            await toast.present();
            return false;
          }
        }
      ]
    });
    await alert.present();
  }

  private validateAminLogin(password: string): boolean {
    return password === this.adminPassword;
  }
 }
