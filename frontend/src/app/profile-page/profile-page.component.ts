import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';

interface UpdateProfileResponse {
  authToken: string;
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
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: ['']
    });
  }

  saveChanges() {
    if (this.profileForm.valid) {
      console.log("frontend | Try submit update request")
      this.http.patch<UpdateProfileResponse>('http://localhost:3000/profile', this.profileForm.value)
        .subscribe({
          next: (response) => {
            if (response && response.authToken) {
              localStorage.setItem('token', response.authToken);
              this.navigateTo('profile');
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
