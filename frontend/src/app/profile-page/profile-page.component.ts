import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';


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
  emailProtectionLink = 'https://example.com';
  emailWhenCommented: boolean;
  emailWhenAnswered: boolean;
  newsAndAnnouncements: boolean;
  weeklyProductUpdates: boolean;
  weeklyBlogDigest: boolean;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {}

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

  saveChanges(): void {
    // Ajoutez votre logique pour sauvegarder les changements ici...
    console.log('Changes saved');
  }

  cancel(): void {
    // Ajoutez votre logique pour annuler les changements ici...
    console.log('Changes cancelled');
  }
}
