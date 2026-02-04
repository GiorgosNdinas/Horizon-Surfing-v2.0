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

  /**
   * Displays an error message.
   * @param message The error message to display.
   * @param header Optional header for the error message. Defaults to 'Error'.
   * @param details Optional additional details about the error.
   */
  showError(message: string, header = 'Error', details?: unknown) {
    this.current.set({ header, message, details });
  }

  /**   
   * Clears the current error message.
   */
  clearError() {
    this.current.set(null);
  }

  constructor() { }

}
