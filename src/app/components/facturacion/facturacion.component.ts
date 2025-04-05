import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FacturacionService } from '../../services/facturacion.service';
import { MatDialog } from '@angular/material/dialog';
import { TransaccionModalComponent } from '../TransaccionModalComponent/transaccion-modal.component';
import { CajeroModalComponent } from '../cajero-modal/cajero-modal.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import  moment from 'moment';
import { HttpParams } from '@angular/common/http';
import { transaccionInterface } from '../../interface/transaccionInterface';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {
  filtrosForm: FormGroup;
  transacciones: transaccionInterface[] = [];
  displayedColumns: string[] = ['codigo_epago', 'fecha_solicitud', 'secuencia_cajero', 'usuario_ingresado', 'valor', 'acciones'];
  totalRegistros = 0;
  pageSize = 10;
  currentPage = 1;
  // Si no se selecciona un rango de fecha, se obtienen todas las transacciones
  buscarPorFechas: boolean = false;

  constructor(
    private fb: FormBuilder,
    private facturacionService: FacturacionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filtrosForm = this.fb.group({
      codigoEpago: [''],
      fechaDesde: [''],
      fechaHasta: ['']
    });
  }

  ngOnInit(): void {
    // Al cargar el componente, obtener todas las transacciones
    this.obtenerTransacciones();
  }

  obtenerTransacciones(): void {
    this.facturacionService.getTransacciones(new HttpParams()).subscribe({
      next: (res) => {
        console.log('Datos recibidos del servidor:', res.rows);
        this.transacciones = res.rows;
        this.totalRegistros = res.totalRows;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar transacciones', 'Cerrar', { duration: 3000 });
        console.error(err);
      }
    });
  }


  buscar(): void {
    const filtros = this.filtrosForm.value;

    // Si se quiere filtrar por fecha, ambos deben tener valor
    if ((filtros.fechaDesde && !filtros.fechaHasta) || (!filtros.fechaDesde && filtros.fechaHasta)) {
      this.snackBar.open('Debes seleccionar ambas fechas para filtrar', 'Cerrar', { duration: 3000 });
      return;
    }

    let params = new HttpParams();
    if (filtros.fechaDesde && filtros.fechaHasta) {
      // Convertir las fechas al formato requerido
      const fechaDesde = moment(filtros.fechaDesde).format('DD/MM/YYYY HH:mm:ss');
      const fechaHasta = moment(filtros.fechaHasta).format('DD/MM/YYYY HH:mm:ss');
      params = params.set('fechaDesde', fechaDesde)
        .set('fechaHasta', fechaHasta);
    }
    if (filtros.codigoEpago) {
      params = params.set('codigoEpago', filtros.codigoEpago);
    }
    // Agregar otros filtros si es necesario...

    this.facturacionService.getTransacciones(params).subscribe({
      next: (res) => {
        // Aquí extraemos las propiedades 'rows' y 'totalRows'
        this.transacciones = res.rows;
        this.totalRegistros = res.totalRows;
      },
      error: (err) => {
        this.snackBar.open('Error al filtrar transacciones', 'Cerrar', { duration: 3000 });
        console.error(err);
      }
    });
  }

  limpiarFiltros(): void {
    this.filtrosForm.reset();
    this.obtenerTransacciones();
  }

  openCajeroModal(): void {
    const dialogRef = this.dialog.open(CajeroModalComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe(selectedCajero => {
      if (selectedCajero) {
        // Puedes asignar el cajero seleccionado a un filtro
        this.filtrosForm.patchValue({ cajeroId: selectedCajero.id });
      }
    });
  }

  openTransaccionModal(transaccion?: transaccionInterface): void {
    console.log('Transacción a editar:', transaccion);
    if (transaccion) {
      console.log('codigoEpago:', transaccion.codigo_epago);
    }
    const codigoEpago = transaccion?.codigo_epago ?? null;
    const dialogRef = this.dialog.open(TransaccionModalComponent, {
      width: '600px',
      data: transaccion ? { ...transaccion } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!transaccion) {
          // Caso de creación
          this.facturacionService.createTransaccion(result).subscribe({
            next: () => {
              this.snackBar.open('Transacción creada', 'Cerrar', { duration: 3000 });
              this.buscar();
            },
            error: () => {
              this.snackBar.open('Error al crear transacción', 'Cerrar', { duration: 3000 });
            }
          });
        } else if (codigoEpago) {
          // Caso de edición
          this.facturacionService.updateTransaccion(codigoEpago, result).subscribe({
            next: () => {
              this.snackBar.open('Transacción actualizada', 'Cerrar', { duration: 3000 });
              this.buscar();
            },
            error: () => {
              this.snackBar.open('Error al actualizar transacción', 'Cerrar', { duration: 3000 });
            }
          });
        } else {
          this.snackBar.open('No se pudo actualizar: código inválido', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  eliminarTransaccion(codigoEpago: number): void {
    if (confirm('¿Desea eliminar este registro?')) {
      this.facturacionService.deleteTransaccion(codigoEpago).subscribe({
        next: () => {
          this.snackBar.open('Transacción eliminada', 'Cerrar', { duration: 3000 });
          this.buscar();
        },
        error: (err) => {
          this.snackBar.open('Error al eliminar transacción', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cambiarPagina(event: any): void {
    // Implementa la lógica de paginación si tu API lo soporta.
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    // Podrías agregar estos parámetros a la consulta de búsqueda si tu API los maneja.
    this.buscar();
  }
}