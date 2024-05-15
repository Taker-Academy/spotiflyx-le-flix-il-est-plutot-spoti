import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler, HttpParams, HttpHeaders } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../global.service';
import { switchMap } from 'rxjs/operators';
import { HeaderComponent } from '../../header/header.component';
import { NgModule, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

interface UpdatePostResponse {
  authToken: string;
}

@Component({
  selector: 'app-post',
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
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  PostForm: FormGroup;
  Link: string;
  isActive = false;
  showYoutubeOption = false;
  showEmojis = false;
  youtubeLink = '';
  selectedFile: File | null = null;
  selectedEmoji: string | null = null;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.PostForm = this.formBuilder.group({
      Title: [''],
      Content: [''],
      Link: [''],
    });
  }

  saveChanges() {
    if (this.PostForm.valid) {
      console.log("frontend | Try submit update request")
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      console.log(this.PostForm)
      this.http.patch<UpdatePostResponse>('http://localhost:3000/forum/post', this.PostForm.value, { headers })
        .subscribe({
          next: (response) => {
            if (response && response.authToken) {
              localStorage.setItem('token', response.authToken);
              this.navigateTo('forum');
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

  openYoutubeDialog(): void {
    const result = window.prompt("Enter YouTube link");
    this.Link = this.youtubeLink = result !== null ? result : '';
    console.log('The dialog was closed');
    console.log(this.Link);
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(reader.result);
    }
    reader.readAsDataURL(file);
  }

  getEmojis() {
    return ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊'];
  }

  toggleEmojis() {
    this.showEmojis = !this.showEmojis;
  }

  selectEmoji(emoji: string) {
    this.selectedEmoji = emoji;
    this.showEmojis = false;
    console.log('Selected emoji:', emoji);
  }

  activateContainer() {
    this.isActive = true;
  }

  deactivateContainer() {
    this.isActive = false;
  }

}
