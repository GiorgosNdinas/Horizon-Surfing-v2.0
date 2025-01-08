import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [],
  template: `<p>activity-list works!</p>`,
  styleUrl: './activity-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityListComponent { }
