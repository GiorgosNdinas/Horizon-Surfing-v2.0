import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DatabaseService } from './servicies/database.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { ErrorAlertComponent } from './components/error-alert/error-alert-component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, ErrorAlertComponent],
})
export class AppComponent {
  constructor(private databaseService: DatabaseService) {
    this.initApp();
  }

  async initApp(){
    await this.databaseService.initializePlugin();
    SplashScreen.hide();
  }
}
