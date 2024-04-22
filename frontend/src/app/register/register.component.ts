import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

interface RegisterResponse {
  token: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    HttpClientModule,
    BrowserModule,
    Router
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  test: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    console.log("register")
    if (this.registerForm.valid) {
      this.http.post<RegisterResponse>('http://localhost:3000/register', this.registerForm.value)
        .subscribe({
          next: (response) => {
            console.log(response)
            if (response.token) {
              localStorage.setItem('token', response.token);
            }
            //this.router.navigate(['/login']);
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
