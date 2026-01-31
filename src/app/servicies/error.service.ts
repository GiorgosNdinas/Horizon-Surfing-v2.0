import { Injectable, signal } from '@angular/core';

export type AppError = {
  header?: string;
  message: string;
  details?: unknown;
};

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  readonly current = signal<AppError | null>(null);

  showError(message: string, header = 'Error', details?: unknown) {
    this.current.set({ header, message, details });
  }

  clearError() {
    this.current.set(null);
  }

  constructor() { }

}
