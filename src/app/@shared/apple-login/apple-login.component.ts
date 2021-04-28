import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Providers } from '../interfaces/providers';

@Component({
  selector: 'app-apple-login',
  templateUrl: './apple-login.component.html',
  styleUrls: ['./apple-login.component.scss'],
})
export class AppleLoginComponent implements OnInit {
  @Output() clicked: EventEmitter<Event> = new EventEmitter();

  public enabled = false;

  @Input() set providers(providers: Providers) {
    if (providers && providers['APPLE']) {
      this.enabled = true;
    }
  }

  constructor() {}

  ngOnInit(): void {}

  onClick(event: Event) {
    this.clicked.emit(event);
  }
}
