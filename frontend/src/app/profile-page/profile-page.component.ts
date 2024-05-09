import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler, HttpHeaders } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';

interface UpdateProfileResponse {
  authToken: string;
}
interface UserProfile {
  id: number;
  profileImage: string;
  username: string;
  firstName: string;
  email: string;
  company: string;
}

@Component({
  selector: 'app-profile-page',
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
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  profileImage: string = "../../../../../spotiflyx-le-flix-il-est-plutot-spoti/back/src/controller/uploads/profileImages/1.png";
  selectedFile: File;
  profileForm: FormGroup;
  emailProtectionLink = 'https://example.com';
  emailWhenCommented: boolean;
  emailWhenAnswered: boolean;
  newsAndAnnouncements: boolean;
  weeklyProductUpdates: boolean;
  weeklyBlogDigest: boolean;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.profileForm = this.formBuilder.group({
      id: '',
      username: [''],
      firstName: [''],
      email: [''],
      company: [''],
      profileImage: ''
    });
  }

  ngOnInit(): void {
    this.printValues();
    console.log(this.profileImage);
  }

  printValues(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<UserProfile>('http://localhost:3000/profile', { headers })
    .subscribe({
      next: (response) => {
        if (response) {
          this.profileForm.patchValue({
            id : response.id,
            username: response.username,
            firstName: response.firstName,
            email: response.email,
            company: response.company
          });
          this.profileImage = `../../../../../spotiflyx-le-flix-il-est-plutot-spoti/back/src/controller/uploads/profileImages/${response.id}.png`;
        } else {
          console.log('No user data in response');
        }
      },
      error: (error) => {
        console.log('Error:', error);
      }
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        // console.log(e.target)
        this.profileImage = e.target.result as string;
        this.profileForm.patchValue({
          profileImage: e.target.result
        });
      }
    };
    reader.readAsDataURL(file);
  }

  saveChanges() {
    if (this.profileForm.valid) {
      console.log("frontend | Try submit update request")
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      console.log(this.profileForm)
      this.http.patch<UpdateProfileResponse>('http://localhost:3000/profile', this.profileForm.value, { headers })
        .subscribe({
          next: (response) => {
            if (response && response.authToken) {
              localStorage.setItem('token', response.authToken);
              this.navigateTo('profile');
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
  connectToTwitter(): void {
    // Ajoutez votre logique pour se connecter à Twitter ici...
  }
  removeGoogleConnection(): void {
    // Ajoutez votre logique pour supprimer la connexion Google ici...
  }
  connectToFacebook(): void {
    // Ajoutez votre logique pour se connecter à Facebook ici...
  }
  connectToInstagram(): void {
    // Ajoutez votre logique pour se connecter à Instagram ici...
  }

  cancel(): void {
    // Ajoutez votre logique pour annuler les changements ici...
    console.log('Changes cancelled');
  }
}
