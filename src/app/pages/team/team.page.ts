import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>team works!</p>`,
  styleUrl: './team.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamPage { }
