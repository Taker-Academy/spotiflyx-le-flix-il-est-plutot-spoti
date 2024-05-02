import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../global.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
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
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  variable = false;
  tokenSpotify: string= ''

  constructor (private globalService : GlobalService, private http: HttpClient,) { }

  ngOnInit(): void {
    this.catchSpotifyToken();
  }

  catchSpotifyToken() {
    console.log('Fonction exécutée à l\'arrivée sur /home');
    this.http.get<{token: string}>('http://localhost:3000/connectSpotify')
    .subscribe({
      next: (response) => {
        if (response.token) {
          console.log("token : ", response.token)
          localStorage.setItem('tokenSpotify', response.token)
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
