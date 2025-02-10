import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [],
  template: `<p>new-activity works!</p>`,
  styleUrl: './new-activity.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewActivityComponent { }
