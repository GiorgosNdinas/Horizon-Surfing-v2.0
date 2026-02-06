import { Injectable, signal } from '@angular/core';
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

  images = signal<LocalFile[]>([]);


  constructor(private loadingCtrl: LoadingController) { }

  /**
   * Loads files from the local filesystem and updates the images signal.
   * 
   * @returns A promise that resolves when the loading process is complete.
   */
  async loadFiles(){
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

  /**
   *  Loads file data for the given file names and updates the images signal.
   * 
   * @param fileNames An array of FileInfo objects representing the files to load.
   * 
   * @return A promise that resolves when the file data has been loaded. 
   */
  async loadFileData(fileNames:FileInfo[]){
    for(let file of fileNames){
      const filePath = `${IMAGE_DIR}/${file.name}`;

      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      });

      this.images.update(prev => [
        ...prev,
        {
          name: file.name,
          path: filePath,
          data: `data:image/jpeg;base64,${readFile.data}`
        }
      ]);
    }
  } 

}
