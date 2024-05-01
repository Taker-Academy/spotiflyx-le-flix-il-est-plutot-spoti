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
  selector: 'app-account-info',
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
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.css'
})
export class AccountInfoComponent {
    emailProtectionLink = 'https://example.com';
    profileForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
      this.profileForm = this.formBuilder.group({
        bio: [''],
        birthday: [''],
        phone: ['', Validators.pattern('^[0-9]*$')],
        website: ['']
      });
    }

    saveChanges() {
      if (this.profileForm.valid) {
        console.log("frontend | Try submit update request")
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.http.patch<UpdateProfileResponse>('http://localhost:3000/profile/account-info', this.profileForm.value, { headers })
          .subscribe({
            next: (response) => {
              if (response && response.authToken) {
                localStorage.setItem('token', response.authToken);
                this.navigateTo('profile/account-info');
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

    cancel(): void {
      // Ajoutez votre logique pour annuler les changements ici...
      console.log('Changes cancelled');
    }
}
