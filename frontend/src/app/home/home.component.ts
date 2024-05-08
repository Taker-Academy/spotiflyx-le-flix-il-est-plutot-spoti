import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler, HttpParams } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../global.service';
import { switchMap } from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';
import { NgModule } from '@angular/core';

interface PopularTracksResponse {
  popularTracks: Track[];
}

interface Track {
  title: string;
  artist: string;
  releaseDate: string;
  trackUrl: string;
  albumImage: string;
}

interface SpotifyCategoriesResponse {
  categories: Category[];
}
interface Category {
  href: string;
  id: string;
  icons: string;
  name: string;
  // Ajoutez d'autres propriétés que vous attendez pour chaque catégorie
}

interface SpotifyCategoriesTracksResponse {
  categoriesTracks: categoryTracks[];
}

interface categoryTracks {
  href: string;
  id: string;
  icons: string;
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
    CommonModule,
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
  tokenSp: string
  doneRequest: boolean = false

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
          this.tokenSp = response.token
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

  categories: string[] = ['Chill', 'Party', 'Mood', 'Rock']
  // récuper toutes les catégories spotify
  catchAllSpotifyCategories(tokenSpotify: string) {
    this.catchAllSpotifyCategoriesTracks(this.categories)
  }

  tabCategoriesTracks: any = [];
  // récuper toutes les catégories spotify
  catchAllSpotifyCategoriesTracks(categories: string[]) {
    this.http.get<{token: string}>('http://localhost:3000/api/spotify/connection').pipe(
        switchMap((response) => {
            console.log("DEBUGGGG")
            if (response.token) {
                let tokenSpotify = response.token;
                let params = new HttpParams().append('tokenSpotify', tokenSpotify);
                for (const category of categories) {
                    params = params.append('category', category);
                }

                return this.http.get<{categoriesTracks: categoryTracks[]}>('http://localhost:3000/api/spotify/categories/tracks', { params });
            } else {
                throw new Error('No token received');
            }
        })
    ).subscribe({
        next: (response: any) => {
            console.log("DEBUGGGG")
            this.tabCategoriesTracks = response
            this.doneRequest = true
        },
        error: (error) => {
            console.error('Error fetching categories:', error);
        }
    });
  }

  searchedTerms : string[] = []
  searchRequest() {
    if (this.searchForm.valid) {
      const searchTerm = this.searchForm.value.searchInput
      this.searchedTerms.push(searchTerm)
      console.log(this.searchedTerms)
      this.searchForm.reset()
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

  category: string[] = [];
  addCategory(categoryName: string): void {
    const index = this.category.indexOf(categoryName);
    if (index === -1) {
      this.category.push(categoryName);
    } else {
      this.category.splice(index, 1);
    }
    this.updateCategories()
  }

  categoryTaked: any[] = [];
  updateCategories() {
    this.categoryTaked = []
    for (let i = 0; i < this.category.length; i++) {
      for (let j = 0; j < this.tabCategoriesTracks.length; j++) {
        if (this.category[i] == this.tabCategoriesTracks[j]?.category) {
          this.categoryTaked.push(this.tabCategoriesTracks[j])
        }
      }
    }
  }

  categoryAddedOrNot(categoryName: string) {
    const index = this.category.indexOf(categoryName);
    if (index === -1) {
      return false
    } else {
      return true
    }
  }
}
