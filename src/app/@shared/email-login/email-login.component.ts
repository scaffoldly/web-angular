import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProviderResponse } from '@app/@openapi/auth';

export type Email = string;

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {
  @Output() clicked: EventEmitter<Email> = new EventEmitter();

  email = new FormControl('', [Validators.required, Validators.email]);

  enabled = false;

  @Input() set providers(providers: ProviderResponse) {
    if (providers && providers['EMAIL'] && providers['EMAIL'].enabled) {
      this.enabled = true;
    }
  }

  constructor() {}

  ngOnInit(): void {}

  onClick(email: Email) {
    this.clicked.emit(email);
  }
}
