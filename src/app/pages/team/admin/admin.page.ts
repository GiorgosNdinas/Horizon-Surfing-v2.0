import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonSelect, IonSelectOption, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { CustomerListComponent } from 'src/app/components/customer-list/customer-list.component';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/servicies/customer.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button defaultHref="/team"></ion-back-button>
      </ion-buttons>
      <ion-title>Admin</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="onExport()">Export</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item>
      <ion-label>Year</ion-label>
      <ion-select [value]="selectedYear()" (ionChange)="onYearChange($event.detail.value)">
        @for(year of yearOptions; track year){
          <ion-select-option [value]="year">{{year}}</ion-select-option>
        }
      </ion-select>
    </ion-item>

    <app-customer-list [customers]="customerList"></app-customer-list>
  </ion-content>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    CustomerListComponent
  ]
})
export class AdminPage implements OnInit {
  readonly currentYear = new Date().getFullYear();
  readonly yearOptions = Array.from({ length: 6 }, (_, index) => this.currentYear - index);
  selectedYear = signal(this.currentYear);

  customerList = this.customerService.dbCustomersSignal;

  constructor(
    private customerService: CustomerService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.customerService.getCustomersByYear(this.selectedYear());
  }

  async onYearChange(year: number) {
    this.selectedYear.set(Number(year));
    await this.customerService.getCustomersByYear(this.selectedYear());
  }

  async onExport() {
    const customers = this.customerList();

    if (!customers.length) {
      await this.presentToast(`No customers found for ${this.selectedYear()}.`, 'medium');
      return;
    }

    const fileName = `customers-${this.selectedYear()}.xlsx`;
    const workbook = this.buildCustomerWorkbook(customers);

    try {
      if (Capacitor.getPlatform() === 'web') {
        this.exportForBrowser(workbook, fileName);
      } else {
        await this.exportForNative(workbook, fileName);
      }

      await this.presentToast(`Exported ${customers.length} customers to ${fileName}.`, 'success');
    } catch (error) {
      console.error('Error exporting customers:', error);
      await this.presentToast('Export failed. Please try again.', 'danger');
    }
  }

  private buildCustomerWorkbook(customers: Customer[]): XLSX.WorkBook {
    const columns: Array<{ key: keyof Customer; title: string }> = [
      { key: 'id', title: 'ID' },
      { key: 'name', title: 'Name' },
      { key: 'surname', title: 'Surname' },
      { key: 'homeAddress', title: 'Home Address' },
      { key: 'hotel', title: 'Hotel' },
      { key: 'hotelRoom', title: 'Hotel Room' },
      { key: 'email', title: 'Email' },
      { key: 'phoneNumber', title: 'Phone Number' },
      { key: 'departureDate', title: 'Departure Date' },
      { key: 'signature', title: 'Signature' },
      { key: 'terms', title: 'Accepted Terms' },
      { key: 'paid', title: 'Paid' }
    ];

    const rows = customers.map((customer) => {
      const row: Record<string, string> = {};

      columns.forEach((column) => {
        row[column.title] = this.toExportValue(customer[column.key]);
      });

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: columns.map((column) => column.title)
    });
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

    return workbook;
  }

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
