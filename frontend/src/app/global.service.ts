import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  
  constructor(private router: Router) {}
  
  public backToHome() {
    this.router.navigate(['/home']);
  }
}
