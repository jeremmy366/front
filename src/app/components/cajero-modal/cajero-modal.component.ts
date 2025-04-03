import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cajero-modal',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Seleccione Cajero</h2>
    <mat-list>
      <mat-list-item *ngFor="let cajero of cajeros" (click)="selectCajero(cajero)">
        {{ cajero.nombre }}
      </mat-list-item>
    </mat-list>
    <div mat-dialog-actions>
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
    </div>
  `,
})
export class CajeroModalComponent {
  cajeros = [
    { id: 1, nombre: 'Cajero 1' },
    { id: 2, nombre: 'Cajero 2' },
    // Agrega más o integra la consulta al API
  ];

  constructor(public dialogRef: MatDialogRef<CajeroModalComponent>) { }

  selectCajero(cajero: any): void {
    this.dialogRef.close(cajero);
  }
}