import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler, HttpParams } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../global.service';
import { switchMap } from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';
import { NgModule, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-forum',
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
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent {
  isIconBarVisible = true;
  isNavigationVisible = false;
  isCommentAreaVisible = false;
  isReplyAreaVisible = false;
  posts: any[] = [];
  private apiUrl = 'http://your-api-url.com/posts';

  constructor(private http: HttpClient) { }

  // ngOnInit() {
  //   this.ForumComponent.getPosts().subscribe(data => {
  //     this.posts = data;
  //   });
  // }

  // getPosts(): Observable<any> {
  //   return this.http.get<any>(this.apiUrl);
  // }

}
