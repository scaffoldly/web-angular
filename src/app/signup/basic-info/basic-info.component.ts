import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountResponse } from '@app/@openapi/auth';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnInit {
  @Output() onNext: EventEmitter<AccountResponse> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  submit(account: AccountResponse) {
    this.onNext.emit(account);
  }
}
