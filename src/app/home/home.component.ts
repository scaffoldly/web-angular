import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from '@app/@core';
import CoreError from '@app/@core/core-error';
import { Account } from '@app/@shared/interfaces/account';
import { AccountService } from '@app/@shared/service/account.service';
import { AuthenticationService } from '@app/@shared/service/authentication.service';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const log = new Logger('Home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
