import { IonButton, ToastController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject, Input, Signal } from '@angular/core';
import { Customer } from 'src/app/models/customer.model';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import * as XLSX from 'xlsx';

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

    const fileName = `customers_${this.selectedYear()}.xlsx`;
    const workbook = this.buildCustomerWorkbook(this.customersForExport);

    try {
      if (Capacitor.getPlatform() === 'web') {
        this.exportForBrowser(workbook, fileName);
      } else {
        await this.exportForNative(workbook, fileName);
      }

      await this.presentToast(`Exported ${this.customersForExport.length} customers to ${fileName}.`, 'success');
    } catch (error) {
      console.error('Error exporting customers:', error);
      await this.presentToast('Export failed. Please try again.', 'danger');
    }

  }

  private buildCustomerWorkbook(customers: Customer[]): XLSX.WorkBook {
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

    const rows = customers.map((customer) => {
      const row: Record<string, string> = {};

      colums.forEach((column) => {
        row[column.title] = this.toExportValue(customer[column.key]);
      });

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: colums.map((column) => column.title)
    });
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

    return workbook;
  }

  // Converts a value to a string suitable for export, handling nulls and objects.
  private toExportValue(value: unknown): string {
    if (value == null) {
      return '';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }


  private exportForBrowser(workbook: XLSX.WorkBook, fileName: string): void {
    const workbookArray = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([workbookArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.rel = 'noopener';
    link.click();

    URL.revokeObjectURL(url);
  }

  private async exportForNative(workbook: XLSX.WorkBook, fileName: string): Promise<void> {
    const workbookBase64 = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });

    const { uri } = await Filesystem.writeFile({
      directory: Directory.Documents,
      path: fileName,
      data: workbookBase64,
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


