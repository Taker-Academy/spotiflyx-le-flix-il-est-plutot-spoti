import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-account-connections',
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
  templateUrl: './account-connections.component.html',
  styleUrl: './account-connections.component.css'
})
export class AccountConnectionsComponent {
    emailProtectionLink = 'https://example.com';

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

    connectToSpotify(): void {
      // Ajoutez votre logique pour se connecter à Facebook ici...
    }

    connectToYoutube(): void {
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
