import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PacientesService, Paciente } from '../../services/pacientes.service';
import { PageEvent } from '@angular/material/paginator';
import { FotoModalComponent } from '../foto-modal/foto-modal.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  displayedColumns: string[] = ['nombreCompleto', 'email', 'foto', 'acciones'];
  totalPacientes = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private pacientesService: PacientesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(pageIndex: number = 0, pageSize: number = this.pageSize): void {
    this.pacientesService.getPacientes(pageIndex, pageSize).subscribe({
      next: (res) => {
        this.pacientes = res.data;
        this.totalPacientes = res.total;
      },
      error: (err) => {
        console.error(err);
        alert('Error al cargar pacientes');
      }
    });
  }

  cambiarPagina(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarPacientes(this.currentPage, this.pageSize);
  }

  abrirFoto(paciente: Paciente): void {
    this.dialog.open(FotoModalComponent, {
      width: '400px',
      data: { paciente }
    });
  }
}