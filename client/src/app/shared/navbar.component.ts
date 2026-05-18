import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div class="container-fluid">

        <a class="navbar-brand fw-bold" routerLink="/">
          PersonApp
        </a>

        <button class="navbar-toggler" type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">

            <li class="nav-item">
              <a class="nav-link"
                 routerLink="/people"
                 routerLinkActive="active"
                 [routerLinkActiveOptions]="{ exact: true }">
                People
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link"
                 routerLink="/about"
                 routerLinkActive="active"
                 [routerLinkActiveOptions]="{ exact: true }">
                About
              </a>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  `
})
export class NavbarComponent {}