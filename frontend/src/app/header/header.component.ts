import { DOCUMENT } from '@angular/common';
import { Component, Inject, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    HttpClientModule,
    BrowserModule,
    Router
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchIconVisible = true;
  searchFormVisible = false;
  navbarActive = false;
  menuOpen = false;

  constructor(@Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {}

  onMenuButtonClick() {
    this.navbarActive = !this.navbarActive;
  }

  onSearchIconClick() {
    this.searchIconVisible = false;
    this.searchFormVisible = true;
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
