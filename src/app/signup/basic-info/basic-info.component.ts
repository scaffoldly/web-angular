import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Account } from '@app/@shared/interfaces/account';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnInit {
  @Output() onNext: EventEmitter<Account> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  submit(account: Account) {
    this.onNext.emit(account);
  }
}
