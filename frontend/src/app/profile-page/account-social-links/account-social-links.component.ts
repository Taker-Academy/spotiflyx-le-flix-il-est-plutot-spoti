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
interface UserSocialLinksProfile {
  Twitter: string;
  Facebook: string;
  Google: string;
  LinkedIn: string;
  Instagram: string;
}
@Component({
  selector: 'app-account-social-links',
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
  templateUrl: './account-social-links.component.html',
  styleUrl: './account-social-links.component.css'
})
export class AccountSocialLinksComponent {
  profileForm: FormGroup;
  emailProtectionLink = 'https://example.com';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.profileForm = this.formBuilder.group({
      Twitter: [''],
      Facebook: [''],
      Google: [''],
      LinkedIn: [''],
      Instagram: ['']
    });
  }

  ngOnInit(): void {
    this.printValues();
  }

  printValues(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<UserSocialLinksProfile>('http://localhost:3000/profile/account-social-links', { headers })
      .subscribe({
        next: (response) => {
          if (response) {
            this.profileForm.patchValue({
              Twitter: response.Twitter,
              Facebook: response.Facebook,
              Google: response.Google,
              LinkedIn: response.LinkedIn,
              Instagram: response.Instagram
            });
          } else {
            console.log('No user data in response');
          }
        },
        error: (error) => {
          console.log('Error:', error);
        }
      });
  }

  saveChanges() {
    if (this.profileForm.valid) {
      console.log("frontend | Try submit update request")
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.patch<UpdateProfileResponse>('http://localhost:3000/profile/account-social-links', this.profileForm.value, { headers })
        .subscribe({
          next: (response) => {
            if (response && response.authToken) {
              localStorage.setItem('token', response.authToken);
              this.navigateTo('profile/account-social-links');
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
