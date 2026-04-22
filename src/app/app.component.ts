import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ThemeToggleComponent],
  template: `<app-theme-toggle></app-theme-toggle><router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
