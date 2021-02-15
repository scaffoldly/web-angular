import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-apple-login',
  templateUrl: './apple-login.component.html',
  styleUrls: ['./apple-login.component.scss'],
})
export class AppleLoginComponent implements OnInit {
  @Output() clicked: EventEmitter<Event> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onClick(event: Event) {
    this.clicked.emit(event);
  }
}
