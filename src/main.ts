import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importa withInterceptorsFromDi
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor'; // Importa tu interceptor
import { HTTP_INTERCEPTORS } from '@angular/common/http'; // Necesario para proveer el interceptor

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptorsFromDi() // Habilita el uso de interceptores basados en DI
    ),
    // Registra el interceptor como proveedor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error(err));