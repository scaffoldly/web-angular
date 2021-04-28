import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Providers } from '../interfaces/providers';
import { AuthenticationService } from '../service/authentication.service';

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

  @Input() set providers(providers: Providers) {
    if (providers && providers['EMAIL']) {
      this.enabled = true;
    }
  }

  constructor() {}

  ngOnInit(): void {}

  onClick(email: Email) {
    this.clicked.emit(email);
  }
}
