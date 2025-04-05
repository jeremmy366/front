import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-transaccion-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
    templateUrl: './transaccion-modal.component.html',
    styleUrls: ['./transaccion-modal.component.scss']
})
export class TransaccionModalComponent implements OnInit {
    transaccionForm: FormGroup;
    // Opciones para el dropdown
    cajeroOptions = [1, 2];
    tipoPagoOptions = ['Tarjeta', 'Efectivo'];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<TransaccionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any  // Si se edita, se inyectan datos; para agregar, es null
    ) {
        this.transaccionForm = this.fb.group({
            secuenciaCajero: [data ? data.secuencia_cajero : 1, Validators.required],
            valor: [data ? data.valor : '', [Validators.required, Validators.min(0.01)]],
            tipoPago: [data ? data.tipoPago : 'Tarjeta', Validators.required],
            referencia: [data ? data.referencia : '', Validators.required],
            // La fecha de solicitud se asigna automáticamente y es de solo lectura
            fechaSolicitud: [{ value: data ? data.fechaSolicitud : new Date().toISOString(), disabled: true }, Validators.required]
        });
    }

    ngOnInit(): void {
        // No se requiere lógica adicional
    }

    onSubmit(): void {
        if (this.transaccionForm.valid) {
            // Como el control de fecha está disabled, usamos getRawValue() para obtenerla
            const formValues = this.transaccionForm.getRawValue();
            this.dialogRef.close(formValues);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
