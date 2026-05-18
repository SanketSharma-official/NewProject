import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />

    <main class="container py-4">
      <router-outlet />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {}