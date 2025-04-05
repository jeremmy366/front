import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PacientesService, Paciente } from '../../services/pacientes.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-foto-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>Foto del Paciente</h2>
    <div mat-dialog-content>
      <!-- Mostrar foto actual si existe -->
      <img *ngIf="paciente.rutaFoto" [src]="getFotoUrl(paciente.rutaFoto)" alt="Foto del paciente" style="max-width: 100%; margin-bottom: 1rem;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <input type="file" accept="image/*" (change)="onFileChange($event)" />
        <button mat-button type="submit" [disabled]="!form.valid || isUploading">Subir Nueva Foto</button>
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
    isUploading = false;

    constructor(
        public dialogRef: MatDialogRef<FotoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { paciente: Paciente },
        private fb: FormBuilder,
        private pacientesService: PacientesService,
        private snackBar: MatSnackBar
    ) {
        this.paciente = data.paciente;
        this.form = this.fb.group({
            file: [null, Validators.required]
        });
    }

    onFileChange(event: any): void {
        if (event.target.files && event.target.files.length > 0) {
            this.selectedFile = event.target.files[0];
            this.form.patchValue({ file: this.selectedFile });
        }
    }

    onSubmit(): void {
        if (this.form.valid && this.selectedFile) {
            this.isUploading = true;
            this.pacientesService.uploadFoto(this.paciente.idPaciente, this.selectedFile).subscribe({
                next: (response) => {
                    this.isUploading = false;
                    this.paciente.rutaFoto = response.rutaFoto; // Actualiza la ruta de la foto
                    this.snackBar.open('Foto subida correctamente', 'Cerrar', { duration: 3000 });
                    this.dialogRef.close(this.paciente); // Devuelve el paciente actualizado
                },
                error: (err) => {
                    this.isUploading = false;
                    this.snackBar.open('Error al subir la foto', 'Cerrar', { duration: 3000 });
                    console.error(err);
                }
            });
        }
    }

    onClose(): void {
        this.dialogRef.close();
    }

    getFotoUrl(rutaFoto: string): string {
        return `http://localhost:3000${rutaFoto}`;
    }
}