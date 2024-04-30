import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

interface EmailResponse {
  token: string;
}

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
  objectForm: string= '';
  messageForm: string= '';
  firstNameForm: string= '';
  lastNameForm: string= '';
  emailInputForm: string= '';
  emailForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.emailForm = this.formBuilder.group({
      object: [this.objectForm, Validators.required],
      message: [this.messageForm, Validators.required],
      firstName: [this.firstNameForm, Validators.required],
      lastName: [this.lastNameForm, Validators.required],
      email: [this.emailInputForm, [Validators.required, Validators.email]]
    });
  }

  submitForm() {
    console.log("debug 1")
    console.log(this.emailForm.value)
    if (this.emailForm.valid) {
      console.log("debug 2")
      console.log("frontend | Try submit update request")
      this.http.post<EmailResponse>('http://localhost:3000/email', this.emailForm.value)
        .subscribe({
          next: (response) => {
            console.log("debug 4")
            this.objectForm = ''
            this.messageForm= ''
            this.toggleDiv()
            return
          },
          error: (error) => {
            console.log("debug 3")
            console.log(error);
            return
          }
        });
    }
    return
  }

  isDiv1Active: boolean = true;
  toggleDiv() {
    this.isDiv1Active = !this.isDiv1Active;
  }

  backToHome() {
    this.router.navigate(['/home']);
  }
}