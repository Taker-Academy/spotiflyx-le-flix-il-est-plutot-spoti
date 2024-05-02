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
  searchForm: FormGroup;

  constructor (private globalService : GlobalService, private http: HttpClient, private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      searchInput: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.catchSpotifyToken();
  }

  catchSpotifyToken() {
    this.http.get<{token: string}>('http://localhost:3000/connectSpotify')
    .subscribe({
      next: (response) => {
        if (response.token) {
          this.tokenSpotify = response.token
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  searchRequest() {
    if (this.searchForm.valid) {
      console.log("Recherche en cours....")
    }
  }


}
