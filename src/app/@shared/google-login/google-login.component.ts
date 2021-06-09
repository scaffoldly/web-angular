import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProviderResponse } from '@app/@openapi/auth';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss'],
})
export class GoogleLoginComponent implements OnInit {
  @Output() clicked: EventEmitter<Event> = new EventEmitter();

  public enabled = false;

  @Input() set providers(providers: ProviderResponse) {
    if (providers && providers['GOOGLE'] && providers['GOOGLE'].enabled) {
      this.enabled = true;
    }
  }

  constructor() {}

  ngOnInit(): void {}

  onClick(event: Event) {
    this.clicked.emit(event);
  }
}
