import { Component, Inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DATA_PROVIDER, DataProvider } from './servicies/data-provider';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(@Inject(DATA_PROVIDER) private dataProvider: DataProvider) {
    this.initApp();
  }

  async initApp(){
    await this.dataProvider.initialize();
    SplashScreen.hide();
  }
}
