import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AgendamientoComponent } from '../agendamiento/agendamiento.component';
import { FacturacionComponent } from '../facturacion/facturacion.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modulos',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.scss'] // Opcional: Para estilos
})
export class ModulosComponent { }
