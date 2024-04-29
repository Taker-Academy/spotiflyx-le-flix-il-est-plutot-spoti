import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-help',
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
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {
  constructor(private router: Router) { }
  objectForm: string= '';
  messageForm: string= '';

  submitForm() {
    this.objectForm = ''
    this.messageForm = ''
  }
}