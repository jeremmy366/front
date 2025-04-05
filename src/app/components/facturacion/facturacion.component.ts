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
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpParams } from '@angular/common/http';
import moment from 'moment';

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
  currentPage = 1;
  filtrosSeleccionados: any = {};

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
    this.cargarTransaccionesIniciales();
  }

  cargarTransaccionesIniciales(): void {
    this.facturacionService.getTransacciones(new HttpParams()).subscribe({
      next: (res) => {
        this.transacciones = res;
        this.totalRegistros = res.length;
      },
      error: (err) => console.error(err)
    });
  }

  buscar(): void {
    const filtros = this.filtrosForm.value;

    // Validar que ambas fechas estén presentes si se aplica filtro
    if (!filtros.fechaDesde || !filtros.fechaHasta) {
      this.snackBar.open('Debes seleccionar un rango de fechas', 'Cerrar', { duration: 3000 });
      return;
    }

    // Convertir fechas al formato DD/MM/YYYY HH:mm:ss
    const params = new HttpParams()
      .set('fechaDesde', moment(filtros.fechaDesde).format('DD/MM/YYYY HH:mm:ss'))
      .set('fechaHasta', moment(filtros.fechaHasta).format('DD/MM/YYYY HH:mm:ss'))
      .set('page', this.currentPage.toString())
      .set('limit', this.pageSize.toString());

    this.facturacionService.getTransacciones(params).subscribe({
      next: (res) => {
        this.transacciones = res;
        this.totalRegistros = res.length;
      },
      error: (err) => console.error(err)
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
