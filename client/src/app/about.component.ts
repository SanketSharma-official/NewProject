import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  template: `
    <p>
      This is an about section that is being added for the knowledge of the user about this application.
      This website is made solely for the purpose of learning and understanding how .NETCore and Angular connect and interact with each other.
      The People Section is meant to serve as the sytarting point for this later evolving into a full fledged website.
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {

}
