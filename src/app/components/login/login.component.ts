import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService]
})
export class LoginComponent {
  errorMessage: string = '';
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      codigoUsuario: ['', Validators.required],
      clave: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const { codigoUsuario, clave } = this.loginForm.value;
    this.authService.login(codigoUsuario!, clave!).subscribe({
      next: (res) => {
        if (res.token) {
          this.authService.setToken(res.token);
          this.router.navigate(['/modulos']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al iniciar sesión';
      }
    });
  }
}
