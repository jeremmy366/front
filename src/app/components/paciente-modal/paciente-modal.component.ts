import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface PacienteFormData {
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    nombreCompleto: string;
    numeroIdentificacion: string;
    email: string;
    codigoTipoIdentificacion: string;
}

@Component({
    selector: 'app-paciente-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './paciente-modal.component.html',
    styleUrls: ['./paciente-modal.component.scss']
})
export class PacienteModalComponent {
    pacienteForm: FormGroup;
    selectedFile: File | null = null;
    // Si data existe, significa que es una edición; de lo contrario, es creación.
    isEditMode: boolean = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<PacienteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PacienteFormData | null
    ) {
        this.isEditMode = !!data;
        this.pacienteForm = this.fb.group({
            primerNombre: [data?.primerNombre || '', Validators.required],
            segundoNombre: [data?.segundoNombre || ''],
            primerApellido: [data?.primerApellido || '', Validators.required],
            segundoApellido: [data?.segundoApellido || ''],
            nombreCompleto: [data?.nombreCompleto || '', Validators.required],
            numeroIdentificacion: [data?.numeroIdentificacion || '', Validators.required],
            email: [data?.email || '', [Validators.required, Validators.email]],
            codigoTipoIdentificacion: [data?.codigoTipoIdentificacion || '', Validators.required]
        });
    }
    

    onFileChange(event: any): void {
        if (event.target.files && event.target.files.length > 0) {
            this.selectedFile = event.target.files[0];
        }
    }

    onSubmit(): void {
        if (this.pacienteForm.valid) {
            const pacienteData = this.pacienteForm.value;
            // Se retorna un objeto con los datos del formulario y, opcionalmente, el archivo
            this.dialogRef.close({ paciente: pacienteData, file: this.selectedFile });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
