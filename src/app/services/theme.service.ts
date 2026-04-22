import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'sedh-theme';
  isDarkMode = false;

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this.isDarkMode = saved === 'dark';
    this.applyTheme();
  }

  toggle() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem(this.STORAGE_KEY, this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    document.body.classList.toggle('dark', this.isDarkMode);
  }
}
