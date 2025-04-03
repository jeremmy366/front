import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transaccion-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <h2 mat-dialog-title>{{ data ? 'Editar Transacción' : 'Nueva Transacción' }}</h2>
  <form [formGroup]="transaccionForm" (ngSubmit)="onSubmit()">
    <mat-form-field appearance="fill">
      <mat-label>Valor</mat-label>
      <input matInput formControlName="valor" type="number">
    </mat-form-field>
    <!-- Agrega los demás campos de la transacción -->
    <div mat-dialog-actions>
      <button mat-button type="button" (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" type="submit" [disabled]="transaccionForm.invalid">Guardar</button>
    </div>
  </form>
  `,
})
export class TransaccionModalComponent {
  transaccionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransaccionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.transaccionForm = this.fb.group({
      valor: [data?.valor || '', Validators.required],
      // Inicializa el resto de campos
    });
  }

  onSubmit(): void {
    if (this.transaccionForm.valid) {
      // Devuelve los datos para ser procesados por el componente padre
      this.dialogRef.close(this.transaccionForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}