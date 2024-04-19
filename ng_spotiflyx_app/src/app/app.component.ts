import { Component, OnInit, Inject, } from '@angular/core';
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
  searchIconVisible = true;
  searchFormVisible = false;
  navbarActive = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {}

  onMenuButtonClick() {
    this.navbarActive = !this.navbarActive;
  }

  onSearchIconClick() {
    this.searchIconVisible = false;
    this.searchFormVisible = true;
  }
}
