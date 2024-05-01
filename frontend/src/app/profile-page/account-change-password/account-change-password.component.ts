import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler, HttpHeaders } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../../header/header.component';

interface UpdateProfileResponse {
  authToken: string;
}

@Component({
  selector: 'app-account-change-password',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent
  ],
  providers: [
    HttpClientModule,
    BrowserModule,
    Router
  ],
  templateUrl: './account-change-password.component.html',
  styleUrl: './account-change-password.component.css'
})
export class AccountChangePasswordComponent {
    emailProtectionLink = 'https://example.com';
    profileForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
      this.profileForm = this.formBuilder.group({
        password: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      });
    }

    changePassword() {
      if (this.profileForm.valid) {
        console.log("frontend | Try submit update request")
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.http.patch<UpdateProfileResponse>('http://localhost:3000/profile/change-password', this.profileForm.value, { headers })
          .subscribe({
            next: (response) => {
              if (response && response.authToken) {
                localStorage.setItem('token', response.authToken);
                this.navigateTo('profile/account-change-password');
              } else {
                console.log('No token in response');
              }
            },
            error: (error) => {
              console.log('Error:', error);
            }
          });
      } else {
        console.log('Form is invalid');
      }
    }
    navigateTo(route: string) {
      this.router.navigate([route]);
    }

    saveChanges(): void {
      // Ajoutez votre logique pour sauvegarder les changements ici...
      console.log('Changes saved');
    }

    cancel(): void {
      // Ajoutez votre logique pour annuler les changements ici...
      console.log('Changes cancelled');
    }
}
