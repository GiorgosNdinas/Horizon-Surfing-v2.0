import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonIcon, IonImg, IonTitle, Platform } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from "@capacitor/camera"
import { LoadFilesService } from 'src/app/servicies/load-files.service';
import { Directory, Filesystem } from '@capacitor/filesystem';

const IMAGE_DIR = 'stored-images';



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
  <ion-card (click) = "selectImage()">
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

  defaultPicture: string = "https://ionicframework.com/docs/img/demos/avatar.svg";

  constructor(private platform: Platform, private loadFilesService: LoadFilesService){
  }

  ngOnInit(): void {
    Camera.requestPermissions({ permissions: ['photos'] });
    this.loadFilesService.loadFiles();
  }
  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    if (image) {
      console.log('-----------', image.webPath);
      
      this.defaultPicture = image.webPath!;
      this.saveImage(image);
    }
  }

  async saveImage(photo: Photo) {
    const base64 = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64!
    });
    this.profilePicture.emit(fileName);
    this.loadFilesService.loadFiles();
  }

  async readAsBase64(photo: Photo) {
    if(this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data;
    }
    return;
  }
}
