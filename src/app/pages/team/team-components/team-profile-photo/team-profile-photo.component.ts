import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonIcon, IonImg, IonTitle } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource, ImageOptions } from "@capacitor/camera"

@Component({
  selector: 'app-team-profile-photo',
  standalone: true,
  imports: [
    CommonModule,
    IonTitle,
    IonCard,
    IonCardContent,
    IonImg,
    IonButton,
    IonIcon
  ],
  template: `
  <ion-title>
    Profile picture
  </ion-title>
  <ion-card (click) = "pickImageFromGallery()">
    <ion-card-content>
      <ion-img [src]="defaultPicture"></ion-img>
      <ion-button fill="clear" color="light">
        <ion-icon slot="icon-only" name="add-outline"></ion-icon>
      </ion-button>
    </ion-card-content>
  </ion-card>
  `,
  styleUrl: './team-profile-photo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamProfilePhotoComponent implements OnInit {

  @Output() profilePicture = new EventEmitter<string>();

  defaultPicture = "https://ionicframework.com/docs/img/demos/avatar.svg";

  ngOnInit(): void {
    Camera.requestPermissions({ permissions: ['photos'] });
  }

  pickImageFromGallery() {
    const options: ImageOptions = {
      source: CameraSource.Photos,
      resultType: CameraResultType.DataUrl
    }
    Camera.getPhoto(options).then((result) => {
      this.defaultPicture = result.dataUrl!;
      this.profilePicture.emit(result.dataUrl!);
    }, (err) => {
      alert(err);
    });
  }
}
