import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from '@app/@shared/interfaces/account';
import { AccountService } from '@app/@shared/service/account.service';
import { AuthenticationService } from '@app/@shared/service/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  id: string;
  name: string;
  company: string;
  activeFragment = 'profile';
  pages = {
    profile: {
      name: 'Profile',
    },
    account: {
      name: 'Account',
    },
  };

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.route.fragment.subscribe((fragment: string) => {
      this.activeFragment = Object.keys(this.pages).find((p) => p === fragment) || Object.keys(this.pages)[0];
    });

    this.accountService.getCurrentAccount().subscribe((account: Account) => {
      if (account) {
        this.id = account.id;
        this.name = account.detail.name;
        this.company = account.detail.company;
      }
    });
  }

  get photoUrl(): string | null {
    const { payload } = this.authenticationService;
    return payload ? payload.photoUrl : null;
  }

  get pageKeys(): string[] {
    return Object.keys(this.pages);
  }
}
