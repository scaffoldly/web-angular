import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from '@app/@core';
import { Account } from '@app/@shared/interfaces/account';
import { AccountService } from '@app/@shared/service/account.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const log = new Logger('Home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  account: Account;
  loading = true;

  constructor(private router: Router, private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.getAccount().subscribe((account: Account | null) => {
      if (!account) {
        log.info('No account, redirecting to signup...');
        this.router.navigate(['/signup']);
        return;
      }
      this.loading = false;
      this.account = account;
    });
  }
}
