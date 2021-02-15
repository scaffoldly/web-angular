import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Payload } from '@app/@shared/interfaces/credential';
import { AccountService } from '@app/@shared/service/account.service';
import { AuthenticationService } from '@app/@shared/service/authentication.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
})
export class AccountDetailComponent implements OnInit {
  methods = { GOOGLE: { name: 'Google' }, APPLE: { name: 'Apple' } }; // TODO Use a better constant elsewhere

  logins: { [key: string]: Payload } = {};

  constructor(private accountService: AccountService, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.loadLogins();
  }

  loadLogins() {
    this.accountService.getLogins().subscribe((logins) => {
      this.logins = logins;
    });
  }

  disconnectSocialLogin(key: string) {
    this.authenticationService.deleteSocialLogin(key).subscribe(() => {
      this.loadLogins();
    });
  }
}
