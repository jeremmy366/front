import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PacienteModalComponent } from '../paciente-modal/paciente-modal.component';
import { FormsModule } from '@angular/forms';

interface Denominacion {
  valor: number;
  billetes: number;
  monedas: number;
  total: number;
}

@Component({
  selector: 'app-flujo',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './flujo.component.html',
  styleUrls: ['./flujo.component.scss']
})
export class FlujoComponent {
  opcionSeleccionada: string = 'ordenesFacturar';
  ordenForm: FormGroup;
  facturaForm: FormGroup;
  ordenSeleccionada: boolean = false;

  // Denominaciones para el cierre de caja
  denominaciones: Denominacion[] = [
    { valor: 100, billetes: 0, monedas: 0, total: 0 },
    { valor: 50, billetes: 0, monedas: 0, total: 0 },
    { valor: 20, billetes: 0, monedas: 0, total: 0 },
    { valor: 10, billetes: 0, monedas: 0, total: 0 },
    { valor: 5, billetes: 0, monedas: 0, total: 0 },
    { valor: 2, billetes: 0, monedas: 0, total: 0 },
    { valor: 1, billetes: 0, monedas: 0, total: 0 }
  ];

  totalBilletes: number = 0;
  totalMonedas: number = 0;
  totalEfectivo: number = 0;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // Formulario para Órdenes para Facturar
    this.ordenForm = this.fb.group({
      numeroOrden: [{ value: '', disabled: true }],
      paciente: [''],
      estado: ['activo'],
      fecha: [new Date()],
      tipoOrden: ['normal'],
      atencionPreferencial: [false],
      urgente: [false],
      medicoInterno: [''],
      medicoExterno: [''],
      diagnosticoPrincipal: [''],
      diagnosticoSecundario1: [''],
      diagnosticoSecundario2: ['']
    });

    // Formulario para Registro Facturas
    this.facturaForm = this.fb.group({
      numeroPaquete: [''],
      institucionBancaria: [''],
      cuentaBancaria: [''],
      facturasManuales: [''],
      notasCredito: ['']
    });
  }

  seleccionar(opcion: string): void {
    this.opcionSeleccionada = opcion;
  }

  // Métodos para Órdenes para Facturar
  nuevaOrden(): void {
    this.ordenForm.reset({
      numeroOrden: new Date().getTime().toString(),
      paciente: '',
      estado: 'activo',
      fecha: new Date(),
      tipoOrden: 'normal',
      atencionPreferencial: false,
      urgente: false,
      medicoInterno: '',
      medicoExterno: '',
      diagnosticoPrincipal: '',
      diagnosticoSecundario1: '',
      diagnosticoSecundario2: ''
    });
    this.ordenSeleccionada = true;
    this.snackBar.open('Nueva orden creada', 'Cerrar', { duration: 3000 });
  }

  crearOrden(): void {
    if (this.ordenForm.valid) {
      console.log('Orden creada:', this.ordenForm.value);
      this.snackBar.open('Orden creada exitosamente', 'Cerrar', { duration: 3000 });
    } else {
      this.snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }

  anularOrden(): void {
    this.ordenForm.patchValue({ estado: 'anulado' });
    console.log('Orden anulada:', this.ordenForm.value);
    this.snackBar.open('Orden anulada', 'Cerrar', { duration: 3000 });
    this.ordenSeleccionada = false;
  }

  buscarPaciente(): void {
    const dialogRef = this.dialog.open(PacienteModalComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ordenForm.patchValue({ paciente: result.paciente.nombreCompleto });
      }
    });
  }

  buscarMedico(tipo: string): void {
    this.snackBar.open(`Buscando médico ${tipo}...`, 'Cerrar', { duration: 3000 });
  }

  buscarDiagnostico(tipo: string): void {
    this.snackBar.open(`Buscando diagnóstico ${tipo}...`, 'Cerrar', { duration: 3000 });
  }

  // Métodos para Cierre de Caja
  calcularTotal(denominacion: Denominacion): void {
    denominacion.total = (denominacion.billetes * denominacion.valor) + (denominacion.monedas * denominacion.valor);
    this.calcularTotales();
  }

  calcularTotales(): void {
    this.totalBilletes = this.denominaciones.reduce((sum, d) => sum + (d.billetes * d.valor), 0);
    this.totalMonedas = this.denominaciones.reduce((sum, d) => sum + (d.monedas * d.valor), 0);
    this.totalEfectivo = this.totalBilletes + this.totalMonedas;
  }

  cerrarCaja(): void {
    console.log('Cierre de caja:', {
      denominaciones: this.denominaciones,
      totalBilletes: this.totalBilletes,
      totalMonedas: this.totalMonedas,
      totalEfectivo: this.totalEfectivo
    });
    this.snackBar.open('Caja cerrada exitosamente', 'Cerrar', { duration: 3000 });
    this.denominaciones.forEach(d => {
      d.billetes = 0;
      d.monedas = 0;
      d.total = 0;
    });
    this.calcularTotales();
  }

  // Métodos para Registro Facturas
  registrarCaso(): void {
    if (this.facturaForm.valid) {
      // Aquí puedes implementar la lógica para enviar los datos al backend
      console.log('Caso registrado:', this.facturaForm.value);
      this.snackBar.open('Caso registrado exitosamente', 'Cerrar', { duration: 3000 });
      this.facturaForm.reset();
    } else {
      this.snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }
}