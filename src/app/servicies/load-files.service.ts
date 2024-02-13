import { Injectable } from '@angular/core';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular/standalone';

const IMAGE_DIR = 'stored-images';

export interface LocalFile {
  name: string;
  path: string;
  data: string | Blob;
}


@Injectable({
  providedIn: 'root'
})
export class LoadFilesService {

  images: LocalFile[] = [];


  constructor(private loadingCtrl: LoadingController) { }

  async loadFiles(){
    this.images = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading data...',
    });

    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR
    }).then(result => {
      this.loadFileData(result.files);
    }, async err => {
      console.log('Err: ', err);
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      });      
    }).then(_ => {
      loading.dismiss();
    })
  }

  async loadFileData(fileNames:FileInfo[]){
    for(let file of fileNames){
      const filePath = `${IMAGE_DIR}/${file.name}`;

      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      });

      this.images.push({
        name: file.name,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      });
    }
  } 

}
