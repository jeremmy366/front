import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Paciente } from '../../services/pacientes.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-foto-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>Foto del Paciente</h2>
    <div mat-dialog-content>
      <!-- Mostrar foto actual si existe -->
      <img *ngIf="paciente.rutaFoto" [src]="paciente.rutaFoto" alt="Foto" style="max-width: 100%; margin-bottom: 1rem;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <input type="file" (change)="onFileChange($event)" />
        <button mat-button type="submit" [disabled]="!form.valid">Subir Nueva Foto</button>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onClose()">Cerrar</button>
    </div>
  `,
    styles: []
})
export class FotoModalComponent {
    paciente: Paciente;
    form: FormGroup;
    selectedFile: File | null = null;

    constructor(
        public dialogRef: MatDialogRef<FotoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {
        // Se espera que se envíe el objeto paciente en los datos inyectados
        this.paciente = data.paciente;
        this.form = this.fb.group({
            file: [null, Validators.required]
        });
    }

    onFileChange(event: any): void {
        if (event.target.files && event.target.files.length > 0) {
            this.selectedFile = event.target.files[0];
            this.form.patchValue({
                file: this.selectedFile
            });
        }
    }

    onSubmit(): void {
        if (this.form.valid) {
            // Aquí implementarías la lógica para subir el archivo a tu API.
            // Por ejemplo, usando FormData y el HttpClient.
            console.log('Subiendo archivo:', this.selectedFile);
            // Una vez finalizado, cierra la modal.
            this.dialogRef.close();
        }
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
