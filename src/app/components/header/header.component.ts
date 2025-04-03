import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // Opcional: Para estilos
})
export class HeaderComponent {
  user: string = 'VERIS';

  constructor(private authService: AuthService, private router: Router) {
    // Aquí podrías extraer el nombre del usuario del token si lo deseas
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
