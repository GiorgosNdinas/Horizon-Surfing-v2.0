import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>customers works!</p>`,
  styleUrl: './customers.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPage { }
