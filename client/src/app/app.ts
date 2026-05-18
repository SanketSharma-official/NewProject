import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from "./shared/layout.component";

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  template: `

   
    <app-layout/>
  `,
  styles: [],
})
export class App {
}
