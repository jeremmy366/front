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
import { MatSnackBar } from '@angular/material/snack-bar';
import { PacienteModalComponent, PacienteFormData } from '../paciente-modal/paciente-modal.component';
import { pacienteInterface } from '../../interface/pacienteInterface';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  displayedColumns: string[] = ['nombreCompleto', 'email', 'rutaFoto', 'acciones'];
  totalPacientes = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private pacientesService: PacientesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarPacientes();
  }

  // Método para abrir el modal de agregar paciente
  openAgregarPacienteModal(): void {
    const dialogRef = this.dialog.open(PacienteModalComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pacientesService.createPaciente(result.paciente, result.file).subscribe({
          next: () => {
            this.snackBar.open('Paciente agregado', 'Cerrar', { duration: 3000 });
            this.cargarPacientes(this.currentPage, this.pageSize);
          },
          error: (err) => {
            this.snackBar.open('Error al agregar paciente', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }


  cargarPacientes(pageIndex: number = 0, pageSize: number = this.pageSize): void {
    this.pacientesService.getPacientes(pageIndex, pageSize).subscribe({
      next: (res) => {
        this.pacientes = res.rows;         // Usar 'rows'
        this.totalPacientes = res.totalRows; // Usar 'totalRows'
      },
      error: (err) => {
        this.snackBar.open('Error al cargar pacientes', 'Cerrar', { duration: 3000 });
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

  editarPaciente(paciente: pacienteInterface): void {
    // Prepara los datos para el formulario. Asegúrate de que los nombres coincidan.
    const formData: PacienteFormData = {
      primerNombre: paciente.primerNombre, // si tienes estos campos en tu interfaz; de lo contrario, ajusta
      segundoNombre: paciente.segundoNombre,
      primerApellido: paciente.primerApellido,
      segundoApellido: paciente.segundoApellido,
      nombreCompleto: paciente.nombreCompleto,
      numeroIdentificacion: paciente.numeroIdentificacion,
      email: paciente.email,
      codigoTipoIdentificacion: paciente.codigoTipoIdentificacion // asegúrate de tener esta propiedad en tu interfaz
    };

    const dialogRef = this.dialog.open(PacienteModalComponent, {
      width: '600px',
      data: formData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Combina los datos nuevos con el id del paciente para enviarlo al servicio
        const pacienteActualizado = { ...paciente, ...result.paciente };
        this.pacientesService.updatePaciente(paciente.idPaciente, pacienteActualizado).subscribe({
          next: () => {
            this.snackBar.open('Paciente actualizado', 'Cerrar', { duration: 3000 });
            this.cargarPacientes(this.currentPage, this.pageSize);
          },
          error: (err) => {
            this.snackBar.open('Error al actualizar paciente', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  eliminarPaciente(id: number): void {
    if (confirm('¿Desea eliminar este paciente?')) {
      this.pacientesService.deletePaciente(id).subscribe({
        next: () => {
          this.snackBar.open('Paciente eliminado', 'Cerrar', { duration: 3000 });
          this.cargarPacientes(this.currentPage, this.pageSize);
        },
        error: (err) => {
          this.snackBar.open('Error al eliminar paciente', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}