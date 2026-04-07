import { IonButton, ToastController  } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject, Input, Signal, WritableSignal } from '@angular/core';
import { Customer } from 'src/app/models/customer.model';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [IonButton],
  template: `
  <ion-button (click)="onExport()">Export</ion-button>`,
  styleUrl: './export-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportButtonComponent {

  @Input() customersForExport!: Customer[];
  @Input() selectedYear!: Signal<number>;
  private toastController = inject(ToastController);

  async onExport() {
    if (!this.customersForExport.length) {
      await this.presentToast(`No customers found for ${this.selectedYear()}.`, 'medium');
      return;
    }

    const fileName = `customers_${this.selectedYear()}.csv`;
    const csv = this.buildCustomerCsv(this.customersForExport);

    try {
      if (Capacitor.getPlatform() === 'web') {
        this.exportForBrowser(csv, fileName);
      } else {
        await this.exportForNative(csv, fileName);
      }

      await this.presentToast(`Exported ${this.customersForExport.length} customers to ${fileName}.`, 'success');
    } catch (error) {
      console.error('Error exporting customers:', error);
      await this.presentToast('Export failed. Please try again.', 'danger');
    }

  }

  private buildCustomerCsv(customers: Customer[]): string {
    const colums: Array<{ key: keyof Customer, title: string }> = [
      { key: 'id', title: 'ID' },
      { key: 'name', title: 'Name' },
      { key: 'surname', title: 'Surname' },
      { key: 'homeAddress', title: 'Home Address' },
      { key: 'hotel', title: 'Hotel' },
      { key: 'hotelRoom', title: 'Hotel Room' },
      { key: 'email', title: 'Email' },
      { key: 'phoneNumber', title: 'Phone Number' },
      { key: 'departureDate', title: 'Departure Date' },
      { key: 'terms', title: 'Accepted Terms' },
      { key: 'paid', title: 'Paid' }
    ];

    const header = colums.map((column) => this.escapeCsvValue(column.title)).join(',');

    const rows = customers.map((customer) => {
      return colums
        .map((column) => this.escapeCsvValue(this.toCsvValue(customer[column.key])))
        .join(',');
    });

    return [header, ...rows].join('\n');
  }

  // Converts a value to a string suitable for CSV output, handling nulls and objects.
  private toCsvValue(value: unknown): string {
    if (value == null) {
      return '';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }

  // Escapes a value for CSV format, adding quotes if necessaryand doubling any existing quotes within the value.
  private escapeCsvValue(value: string): string {
    const escapedValue = value.replace(/"/g, '""');
    return /[",\n\r]/.test(escapedValue) ? `"${escapedValue}"` : escapedValue;
  }

  private exportForBrowser(csv: string, fileName: string): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.rel = 'noopener';
    link.click();

    URL.revokeObjectURL(url);
  }

  private async exportForNative(csv: string, fileName: string): Promise<void> {
    const { uri } = await Filesystem.writeFile({
      directory: Directory.Documents,
      path: fileName,
      data: csv,
      encoding: Encoding.UTF8,
      recursive: true
    });

    const fileUrl = Capacitor.convertFileSrc(uri);
    const openedWindow = window.open(fileUrl, '_blank');

    if (!openedWindow) {
      window.open(uri, '_system');
    }
  }
  
  private async presentToast(message: string, color: 'success' | 'medium' | 'danger') { 
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color
    });
    await toast.present();
  }
}


