import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FacturacionService, Transaccion } from '../../services/facturacion.service';
import { MatDialog } from '@angular/material/dialog';
import { TransaccionModalComponent } from '../transaccion-modal/transaccion-modal.component';
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
  transacciones: Transaccion[] = [];
  displayedColumns: string[] = ['codigoEpago', 'valor', 'acciones'];
  totalRegistros = 0;
  pageSize = 10;
  filtrosSeleccionados: any = {};

  constructor(
    private fb: FormBuilder,
    private facturacionService: FacturacionService,
    private dialog: MatDialog
  ) {
    this.filtrosForm = this.fb.group({
      codigoEpago: [''],
      fechaDesde: [''],
      fechaHasta: ['']
    });
  }

  ngOnInit(): void {
    // Por ejemplo, puedes cargar registros al iniciar o esperar a la búsqueda
  }

  buscar(): void {
    const filtros = this.filtrosForm.value;
    // Validar que el rango de fecha sea obligatorio y máximo de 30 días
    if ((filtros.fechaDesde && !filtros.fechaHasta) || (!filtros.fechaDesde && filtros.fechaHasta)) {
      alert('Debe seleccionar ambas fechas del rango');
      return;
    }
    if (filtros.fechaDesde && filtros.fechaHasta) {
      const diffDias = (new Date(filtros.fechaHasta).getTime() - new Date(filtros.fechaDesde).getTime()) / (1000 * 3600 * 24);
      if (diffDias > 30) {
        alert('El rango máximo permitido es de 30 días');
        return;
      }
    }
    const diffDias = (new Date(filtros.fechaHasta).getTime() - new Date(filtros.fechaDesde).getTime()) / (1000 * 3600 * 24);
    if (diffDias > 30) {
      alert('El rango máximo permitido es de 30 días');
      return;
    }
    // Agregar otros filtros si se han seleccionado (por ejemplo, cajero)
    if (this.filtrosSeleccionados.cajero) {
      filtros.cajeroId = this.filtrosSeleccionados.cajero.id;
    }
    this.facturacionService.getTransacciones(filtros).subscribe({
      next: (res) => {
        this.transacciones = res;
        // Actualiza totalRegistros si el backend lo envía
      },
      error: (err) => {
        console.error(err);
        alert('Error al cargar transacciones');
      }
    });
  }

  limpiarFiltros(): void {
    this.filtrosForm.reset();
    this.filtrosSeleccionados = {};
    this.transacciones = [];
  }

  openCajeroModal(): void {
    const dialogRef = this.dialog.open(CajeroModalComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(selectedCajero => {
      if (selectedCajero) {
        this.filtrosSeleccionados.cajero = selectedCajero;
      }
    });
  }

  openTransaccionModal(transaccion?: Transaccion): void {
    const dialogRef = this.dialog.open(TransaccionModalComponent, {
      width: '600px',
      data: transaccion ? { ...transaccion } : null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const filtros = this.filtrosForm.value;
        if (filtros.fechaDesde && filtros.fechaHasta) {
          this.buscar();
        } else {
          // Si no hay fechas, puedes cargar todo o mostrar un mensaje
          console.log("No se recargó porque no hay rango de fechas seleccionado.");
        }
      }
    });
  }

  eliminarTransaccion(transaccion: Transaccion): void {
    if (confirm('¿Desea eliminar este registro?')) {
      this.facturacionService.deleteTransaccion(transaccion.codigoEpago).subscribe({
        next: () => this.buscar(),
        error: (err) => alert('Error al eliminar el registro')
      });
    }
  }

  cambiarPagina(event: any): void {
    // Implementar la lógica de paginación, por ejemplo ajustando los parámetros de la consulta
  }
}
