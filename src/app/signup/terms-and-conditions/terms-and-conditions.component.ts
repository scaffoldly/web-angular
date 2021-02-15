import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent implements OnInit {
  @Output() onNext: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
