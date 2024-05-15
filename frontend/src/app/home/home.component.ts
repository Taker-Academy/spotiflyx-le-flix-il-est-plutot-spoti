import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler, HttpParams, HttpHeaders } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../global.service';
import { switchMap } from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';
import { NgModule } from '@angular/core';
import { trace } from 'console';
import { Observable } from 'rxjs';

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
            this.tabCategoriesTracks = response
            this.doneRequest = true
        },
        error: (error) => {
            console.error('Error fetching categories:', error);
        }
    });
  }

  searchedTerms : string[] = []
  search: any[] = []
  searchRequest() {
    if (this.searchForm.valid) {
      const searchTerm = this.searchForm.value.searchInput
      this.searchedTerms.push(searchTerm)
      const params = new HttpParams().set('query', searchTerm);

      this.http.get<{searchTab: any}>('http://localhost:3000/api/spotify/search/track', {
        params: {input: searchTerm}
      })
      .subscribe({
        next: (response: any) => {
          this.search = response
          console.log(this.search)
        },
        error: (error) => {
          console.error("Error Search function", error)
        }
      });
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

  boolButtonListen: boolean = false

  boolButton() {
    this.boolButtonListen = true
  }

  boolButtonLeft() {
    this.boolButtonListen = false
  }

  
  playedAudio: { url: string, audio: HTMLAudioElement }[] = []
  currentAudio: HTMLAudioElement | null = null
  private audioDuration: number = 0;
  audioDurationFormatted: string = '0:00';
  remainingTime: number = 0;
  progress: number = 0;
  private timer: any;
  isPaused: boolean = false;
  
  isMusicPlaying(): boolean {
    return this.currentAudio instanceof HTMLAudioElement;
  }

  isMusicPause(): boolean {
    return this.isPaused;
  }

  listenMusic(idMusic: any) {
    this.http.post('http://localhost:3000/api/spotify/listen/track', {
        params: {input: idMusic}
    })
    .subscribe({
      next: (response: any) => {
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        }

        // Créer et lire le nouvel audio
        const newAudio = new Audio(response.previewUrl);
        newAudio.play().catch(error => {
          console.error("Error playing audio", error);
        });

        // Ajouter la nouvelle musique à l'historique des musiques jouées
        this.playedAudio.push({ url: response.previewUrl, audio: newAudio });

        // Mettre à jour l'audio actuel
        this.currentAudio = newAudio;

        this.currentAudio.addEventListener('loadedmetadata', () => {
          this.audioDuration = this.currentAudio?.duration || 0;
          this.audioDurationFormatted = this.getFormattedTime(this.audioDuration);
          this.updateProgress();
        });

        this.currentAudio.addEventListener('timeupdate', () => {
          this.updateProgress();
        });

        this.currentAudio.addEventListener('ended', () => {
          this.clearProgress();
        });

        this.isPaused = false;
      },
      error: (error) => {
        console.error("Error Search function", error)
      }
    });
  }

  togglePause() {
    if (this.currentAudio) {
      if (this.isPaused) {
        this.currentAudio.play().catch(error => {
          console.error("Error resuming audio", error);
        });
      } else {
        this.currentAudio.pause();
      }
      this.isPaused = !this.isPaused;
    }
  }

  updateProgress() {
    if (this.currentAudio) {
      const currentTime = this.currentAudio.currentTime;
      this.remainingTime = this.audioDuration - currentTime;
      this.progress = (currentTime / this.audioDuration) * 100;
    }
  }

  clearProgress() {
    this.remainingTime = 0;
    this.progress = 0;
    this.isPaused = false;
  }

  getFormattedTime(time: number): string {
    const minutes: number = Math.floor(time / 60);
    const seconds: number = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  infoTrack: any = []
  infoMusicBar(track: string[]) {
    this.infoTrack = track
    console.log(this.infoTrack)
  }


  isHovered: boolean = false;
  boolFavorite: boolean = false;
  favoriteMusic: { id: string, img: string, name: string, artist: string }[] = [];

  // Vérifie si une musique est en favoris
  checkIfFavorite(idMusic: string): boolean {
    return this.favoriteMusic.some(music => music.id === idMusic);
  }

  // Ajoute ou retire une musique des favoris
  addFavorite(idMusic: string, imgMusic: string, nameMusic: string, artistMusic: string): void {
    const isAlreadyFavorite = this.checkIfFavorite(idMusic);
    this.boolFavorite = !isAlreadyFavorite;
    
    if (this.boolFavorite) {
      this.favoriteMusic.push({
        id: idMusic,
        img: imgMusic,
        name: nameMusic,
        artist: artistMusic
      });
      this.addFavoriteRequest(idMusic);
    } else {
      const index = this.favoriteMusic.findIndex(music => music.id === idMusic);
      if (index !== -1) {
        this.favoriteMusic.splice(index, 1);
        this.delFavoriteRequest(idMusic);
      }
    }
  }
  
  // requête pour ajouter une musique en favoris
  addFavoriteRequest(idMusic: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { favoriteMusicId: idMusic };
  
    this.http.post('http://localhost:3000/api/spotify/favorites/add', body, { headers })
      .subscribe({
        next: (response) => {
          console.log('Music added to favorites successfully:', response);
        },
        error: (error) => {
          console.error('Error adding music to favorites:', error);
        }
      });
  }
  
  // requête pour retirer une musique des favoris
  delFavoriteRequest(idMusic: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { favoriteMusicId: idMusic };
  
    this.http.post('http://localhost:3000/api/spotify/favorites/del', body, { headers })
      .subscribe({
        next: (response) => {
          console.log('Music removed from favorites successfully:', response);
        },
        error: (error) => {
          console.error('Error removing music from favorites:', error);
        }
      });
  }
}
