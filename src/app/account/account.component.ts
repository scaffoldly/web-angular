import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountResponse } from '@app/@openapi/auth';
import { AuthenticationService } from '@app/@shared/service/authentication.service';
import { CurrentAccountService } from '@app/@shared/service/current-account.service';
import { SocialAuthService } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  id: string;
  name: string;
  email: string;
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
    private currentAccountService: CurrentAccountService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.route.fragment.subscribe((fragment: string) => {
      this.activeFragment = Object.keys(this.pages).find((p) => p === fragment) || Object.keys(this.pages)[0];
    });

    this.currentAccountService.get().subscribe((account: AccountResponse) => {
      if (account) {
        this.id = account.id;
        this.name = account.name;
        this.email = account.email;
        this.company = account.company;
      }
    });
  }

  get photoUrl(): string {
    return this.authenticationService.photoUrl;
  }

  get pageKeys(): string[] {
    return Object.keys(this.pages);
  }
}
