import { IonAlert } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ErrorService } from 'src/app/servicies/error.service';

@Component({
  selector: 'app-error-alert-component',
  standalone: true,
  imports: [IonAlert],
  template: `
    <ion-alert
      [isOpen]="isOpen()"
      [header]="header()"
      [message]="message()"
      [buttons]="buttons">
    </ion-alert>
  `,
  styleUrl: './error-alert-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorAlertComponent {
  private errors = inject(ErrorService);

  isOpen = computed(() => this.errors.current() !== null);
  header = computed(() => this.errors.current()?.header ?? 'Error');
  message = computed(() => {
    const err = this.errors.current();
    if (!err) return '';
    return err.message;
  });

  buttons = [
    {
      text: 'OK',
      role: 'confirm',
      handler: () => this.errors.clearError(),
    },
  ];

 }
