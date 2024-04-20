import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
  loginForm: FormGroup;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  login(event: Event) {
    event.preventDefault();
    this.http.post<LoginResponse>('http://localhost:3000/api/login', this.loginForm.value)
    .subscribe(response => {
      console.log(response);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      this.router.navigate(['/home']);
    }, error => {
      console.log(error);
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
