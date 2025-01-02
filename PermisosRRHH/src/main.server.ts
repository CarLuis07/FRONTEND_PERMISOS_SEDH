import { AppComponent } from './app/app.component';  // Cambiar a AppComponent
import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);  // Cambiar a AppComponent

export default bootstrap;
