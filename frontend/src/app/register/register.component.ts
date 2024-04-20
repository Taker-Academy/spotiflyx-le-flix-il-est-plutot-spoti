import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface RegisterResponse {
  token: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.http.post<RegisterResponse>('http://localhost:5432/register', this.registerForm.value)
        .subscribe({
          next: (response) => {
            if (response.token) {
              localStorage.setItem('token', response.token);
            }
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.log(error);
          }
        });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  navigateToHome() {
    this.router.navigate(['/home']);
  }
  navigateToLegalConditions() {
    this.router.navigate(['/legal']);
  }
}
