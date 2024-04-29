import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    CommonModule
  ],
  providers: [
    HttpClientModule,
    BrowserModule,
    Router
  ],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {
  constructor(private router: Router) { }
  objectForm: string= '';
  messageForm: string= '';

  submitForm() {
    if (this.objectForm == '' || this.messageForm == '') {
      return
    }
    this.objectForm = ''
    this.messageForm = ''
    this.toggleDiv()
  }

  isDiv1Active: boolean = true;
  toggleDiv() {
    this.isDiv1Active = !this.isDiv1Active;
  }

  backToHome() {
    this.router.navigate(['/home']);
  }
}