import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @Output() contact = new EventEmitter();

  onContactClicked() {
    this.contact.emit();
  }
}
