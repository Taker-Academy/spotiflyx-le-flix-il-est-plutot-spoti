import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchIconVisible = true;
  searchFormVisible = false;
  navbarActive = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  onMenuButtonClick() {
    this.navbarActive = !this.navbarActive;
  }

  onSearchIconClick() {
    this.searchIconVisible = false;
    this.searchFormVisible = true;
  }
}
