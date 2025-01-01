import { LoginComponent } from './app/pages/login/login.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(LoginComponent, config);

export default bootstrap;
