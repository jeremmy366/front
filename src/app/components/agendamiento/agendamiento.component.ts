import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PacientesComponent } from '../pacientes/pacientes.component';
import { FlujoComponent } from '../flujo/flujo.component';


export interface Paciente {
  id: number;
  nombre: string;
  edad: number;
  enfermedad?: string;
}

@Component({
  selector: 'app-agendamiento',
  standalone: true,
  imports: [CommonModule, PacientesComponent, FlujoComponent, MatButtonModule],
  templateUrl: './agendamiento.component.html',
  styleUrls: ['./agendamiento.component.scss']
})
export class AgendamientoComponent {
  // Propiedad para cambiar entre las vistas 'pacientes' y 'flujo'
  viewSelected: string = 'pacientes';

  pacientes: Paciente[] = [
    { id: 1, nombre: 'Juan Pérez', edad: 30, enfermedad: 'Gripe' },
    { id: 2, nombre: 'Ana Gómez', edad: 40, enfermedad: 'Dolor de cabeza' }
  ];

  // Función para cambiar entre vistas
  selectView(view: string): void {
    this.viewSelected = view;
  }

  // Función para agregar un paciente nuevo
  addPaciente(paciente: Paciente): void {
    // Generar un ID único para el paciente (puede ser el timestamp, por ejemplo)
    paciente.id = new Date().getTime();
    this.pacientes.push(paciente);
  }

  // Función para editar un paciente existente
  editPaciente(updatedPaciente: Paciente): void {
    const index = this.pacientes.findIndex(p => p.id === updatedPaciente.id);
    if (index !== -1) {
      this.pacientes[index] = updatedPaciente;
    }
  }

  // Función para eliminar un paciente
  deletePaciente(id: number): void {
    if (confirm('¿Deseas eliminar este paciente?')) {
      this.pacientes = this.pacientes.filter(p => p.id !== id);
    }
  }
}
