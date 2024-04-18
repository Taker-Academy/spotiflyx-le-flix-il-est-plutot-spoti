import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.addEventListeners();
  }

  addEventListeners() {
    let navbar = this.document.querySelector('.navbar');
    let searchForm = this.document.querySelector('.search-form');

    this.document.querySelector('#menu-btn')?.addEventListener('click', () => {
      if (navbar) {
        navbar.classList.toggle('active');
      }
    });

    this.document.querySelector('#search-btn')?.addEventListener('click', () => {
      if (searchForm) {
        searchForm.classList.toggle('active');
      }
    });
  }
}
