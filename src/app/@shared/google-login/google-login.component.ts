import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Providers } from '../interfaces/providers';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss'],
})
export class GoogleLoginComponent implements OnInit {
  @Output() clicked: EventEmitter<Event> = new EventEmitter();

  public enabled = false;

  @Input() set providers(providers: Providers) {
    if (providers && providers['GOOGLE']) {
      this.enabled = true;
    }
  }

  constructor() {}

  ngOnInit(): void {}

  onClick(event: Event) {
    this.clicked.emit(event);
  }
}
