import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { VerificationMethod } from '@app/@openapi/auth';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss'],
})
export class VerificationCodeComponent implements OnInit {
  @Output() clicked: EventEmitter<string> = new EventEmitter();

  @Input() verificationMethod: VerificationMethod;

  code = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);

  constructor() {}

  ngOnInit(): void {}

  onClick(code: string) {
    this.clicked.emit(code);
  }
}
