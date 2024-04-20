import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css']
})
export class LegalComponent {
  constructor(private router: Router) { }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
