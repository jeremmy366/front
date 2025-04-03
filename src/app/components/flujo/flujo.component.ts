import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-flujo',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './flujo.component.html',
  styleUrls: ['./flujo.component.scss']
})
export class FlujoComponent {
  opcionSeleccionada: string = '';

  seleccionar(opcion: string): void {
    this.opcionSeleccionada = opcion;
  }
}