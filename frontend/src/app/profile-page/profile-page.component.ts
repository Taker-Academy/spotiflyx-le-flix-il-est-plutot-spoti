import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';

interface RegisterResponse {
  token: string;
}

@Component({
  selector: 'app-profile-page',
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
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  profileForm: FormGroup;
  emailProtectionLink = 'https://example.com';
  emailWhenCommented: boolean;
  emailWhenAnswered: boolean;
  newsAndAnnouncements: boolean;
  weeklyProductUpdates: boolean;
  weeklyBlogDigest: boolean;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.profileForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: ['']
    });
  }

  saveChanges() {
    if (this.profileForm.valid) {
      console.log("frontend | Try submit update request")
      this.http.put<RegisterResponse>('http://localhost:3000/profile', this.profileForm.value)
        .subscribe({
          next: (response) => {
            if (response.token) {
              localStorage.setItem('token', response.token);
            }
            this.navigateTo('profile');
          },
          error: (error) => {
            console.log(error);
          }
        });
    }
  }
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  connectToTwitter(): void {
    // Ajoutez votre logique pour se connecter à Twitter ici...
  }
  removeGoogleConnection(): void {
    // Ajoutez votre logique pour supprimer la connexion Google ici...
  }
  connectToFacebook(): void {
    // Ajoutez votre logique pour se connecter à Facebook ici...
  }
  connectToInstagram(): void {
    // Ajoutez votre logique pour se connecter à Instagram ici...
  }

  cancel(): void {
    // Ajoutez votre logique pour annuler les changements ici...
    console.log('Changes cancelled');
  }
}
