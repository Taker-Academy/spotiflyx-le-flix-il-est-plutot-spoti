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

  tabCategories: any = [];
  // récuper toutes les catégories spotify
  catchAllSpotifyCategories(tokenSpotify: string) {
    this.http.get<{categories: Category[]}>('http://localhost:3000/api/spotify/categories', {
      params: { tokenSpotify: tokenSpotify }
    })
    .subscribe({
      next: (response: any) => {
        this.tabCategories = response; // Stocke les catégories dans tabCategories
        // console.log(this.tabCategories)
        // console.log(this.tabCategories.length)
        // this.tabCategories.splice(0, 1)
        // console.log(this.tabCategories.length)

        // console.log(this.tabCategories)
        // this.tabCategories.splice(14, 1)
        // this.tabCategories.splice(10, 1)
        // this.tabCategories.splice(7, 1)
        // this.tabCategories.splice(6, 1)
        // this.tabCategories.splice(4, 1)
        // this.tabCategories.splice(2, 1)
        // this.tabCategories.splice(1, 1)
        // this.tabCategories.splice(0, 1)

          // gestion d'erreur des catégories
          // for (let category of this.tabCategories) {
            // const index = this.tabCategories.indexOf(category);
            // let params = new HttpParams()
              // .append('tokenSpotify', tokenSpotify)
              // .append('categoryName', category); // Assurez-vous que 'name' est la propriété correcte
            // if (index == -1) {
              // continue
            // } else {
              
              // this.http.get<{popularTracks: Track[]}>('http://localhost:3000/api/spotify/categories/errorhandling', { params })
              // .subscribe({
                // next: (response: any) => {
                  // la catégorie fonctionne donc on ne la supprime pas
                // },
                // error: (error) => {
                  // la catégories est invalide donc on la supprime
                  // this.tabCategories.splice(index, 1)
                // }
              // });  
            // }
          // }
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  tabCategoriesTracks: any = [];
  // récuper toutes les catégories spotify
  catchAllSpotifyCategoriesTracks() {
    this.http.get<{token: string}>('http://localhost:3000/api/spotify/connection').pipe(
        switchMap((response) => {
            if (response.token) {
                let tokenSpotify = response.token;
                let params = new HttpParams().append('tokenSpotify', tokenSpotify);
                for (const category of this.category) {
                    params = params.append('category', category);
                }

                return this.http.get<{categoriesTracks: categoryTracks[]}>('http://localhost:3000/api/spotify/categories/tracks', { params });
            } else {
                throw new Error('No token received');
            }
        })
    ).subscribe({
        next: (response: any) => {
            this.tabCategoriesTracks = response
            console.log(this.tabCategoriesTracks)
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

  category: string[] = [];
  addCategory(categoryName: string): void {
    const index = this.category.indexOf(categoryName);
    if (index === -1) {
      this.category.push(categoryName);
    } else {
      this.category.splice(index, 1);
    }
    if (this.category.length > 0) {
      this.catchAllSpotifyCategoriesTracks()
    } else {
      this.tabCategoriesTracks = ['']
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
