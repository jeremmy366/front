import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ModulosComponent } from './components/modulos/modulos.component';
import { AgendamientoComponent } from './components/agendamiento/agendamiento.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';

export const appRoutes: Routes = [
    { path: '', component: LoginComponent },
    {
        path: 'modulos',
        component: ModulosComponent,
        children: [
            { path: 'agendamiento', component: AgendamientoComponent },
            { path: 'facturacion', component: FacturacionComponent },
            { path: '', redirectTo: 'agendamiento', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '' }
];
