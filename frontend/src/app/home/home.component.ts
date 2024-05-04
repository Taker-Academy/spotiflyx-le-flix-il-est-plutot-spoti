import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../global.service';
import { HeaderComponent } from '../header/header.component';

interface Track {
  title: string;
  artist: string;
  releaseDate: string;
  trackUrl: string;
  albumImage: string;
}

interface PopularTracksResponse {
  popularTracks: Track[];
}

interface SpotifyCategoriesResponse {
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  // Ajoutez d'autres propriétés que vous attendez pour chaque catégorie
}

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
  searchForm: FormGroup;
  typeSettings: boolean = true
  typeCategories: boolean = true

  constructor (private globalService : GlobalService, private http: HttpClient, private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      searchInput: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.catchSpotifyToken()
  }

  // récuperer le token spotify
  catchSpotifyToken() {
    this.http.get<{token: string}>('http://localhost:3000/api/spotify/connection')
    .subscribe({
      next: (response) => {
        if (response.token) {
          this.popularMusicContent(response.token)
          this.catchAllSpotifyCategories(response.token)
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  popularAlbumTab: any = []
  // récuperer des musiques et des vidéos populaire
  popularMusicContent(tokenSpotify: string) {
    this.http.get<{popularTracks: Track[]}>('http://localhost:3000/api/spotify/popular-content', {
      params: {tokenSpotify : tokenSpotify}
    })
    .subscribe({
      next: (response: any) => {
        this.popularAlbumTab = response
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  tabCategories: Category[] = [];
  // récuper toutes les catégories spotify
  catchAllSpotifyCategories(tokenSpotify: string) {
  this.http.get<SpotifyCategoriesResponse>('http://localhost:3000/api/spotify/categories', {
    params: { tokenSpotify: tokenSpotify }
  })
  .subscribe({
    next: (response: SpotifyCategoriesResponse) => {
      this.tabCategories = response.categories; // Stocke les catégories dans tabCategories
      console.log('Retrieved categories:', this.tabCategories);
    },
    error: (error) => {
      console.error('Error fetching categories:', error);
    }
  });
}


  searchRequest() {
    if (this.searchForm.valid) {
      console.log("Recherche en cours....")
    }
  }

  settingsMusic() {
    if (this.typeSettings == false) {
      return
    }
    this.typeSettings = !this.typeSettings
  }

  settingsVideo() {
    if (this.typeSettings == true) {
      return
    }
    this.typeSettings = !this.typeSettings
  }

  categoriesMusic() {
    if (this.typeCategories == false) {
      return
    }
    this.typeCategories = !this.typeCategories
  }

  categoriesVideo() {
    if (this.typeCategories == true) {
      return
    }
    this.typeCategories = !this.typeCategories
  }
}
