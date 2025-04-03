import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacientesComponent } from '../pacientes/pacientes.component';
import { FlujoComponent } from '../flujo/flujo.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-agendamiento',
  standalone: true,
  imports: [CommonModule, PacientesComponent, FlujoComponent, MatButtonModule],
  templateUrl: './agendamiento.component.html',
  styleUrls: ['./agendamiento.component.scss']
})
export class AgendamientoComponent {
  // Propiedad para determinar qué vista se muestra: 'pacientes' o 'flujo'
  viewSelected: string = 'pacientes';

  // Función para cambiar la vista
  selectView(view: string): void {
    this.viewSelected = view;
  }
}
