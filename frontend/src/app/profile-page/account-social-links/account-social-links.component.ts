import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../../header/header.component';

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
    constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {}

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
