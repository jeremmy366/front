import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { transaccionInterface } from './../../interface/transaccionInterface';

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
        @Inject(MAT_DIALOG_DATA) public data: transaccionInterface | null
    ) {
        this.transaccionForm = this.fb.group({
            secuenciaCajero: [data ? data.secuenciaCajero : 1, Validators.required],
            valor: [data ? data.valor : '', [Validators.required, Validators.min(0.01)]],
            tipoPago: [data ? data.tipoPago : 'Tarjeta', Validators.required],
            referencia: [data ? data.referencia : '', Validators.required],
            usuario_ingresado: [data ? data.usuario_ingresado : '', Validators.required],
            // La fecha de solicitud se asigna automáticamente y es de solo lectura
            fechaSolicitud: [{ value: data ? data.fechaSolicitud : new Date().toISOString(), disabled: true }, Validators.required]
        });
    }

    ngOnInit(): void {
        // No se requiere lógica adicional
    }

    onSubmit(): void {
        if (this.transaccionForm.valid) {
            const updatedTransaccion = {
                ...this.data, // Mantiene los datos originales, incluyendo codigoEpago
                ...this.transaccionForm.value // Sobrescribe con los valores editados
            };
            const formValues = this.transaccionForm.getRawValue();

            // Si es edición, añadimos el código de la transacción al objeto
            const result = this.data?.codigo_epago
                ? { ...formValues, codigoEpago: this.data.codigo_epago }
                : formValues;

            this.dialogRef.close(result);
        }
    }


    onCancel(): void {
        this.dialogRef.close();
    }
}
