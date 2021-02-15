import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/@shared/service/credentials.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  activeFragment = 'profile';
  pages = {
    profile: {
      name: 'Profile',
    },
    account: {
      name: 'Account',
    },
  };

  constructor(private route: ActivatedRoute, private credentialsService: CredentialsService) {}

  ngOnInit() {
    this.route.fragment.subscribe((fragment: string) => {
      this.activeFragment = Object.keys(this.pages).find((p) => p === fragment) || Object.keys(this.pages)[0];
    });
  }

  get name(): string | null {
    const credentials = this.credentialsService.credential;
    return credentials ? credentials.payload.name : null;
  }

  get email(): string | null {
    const credentials = this.credentialsService.credential;
    return credentials ? credentials.payload.email : null;
  }

  get photoUrl(): string | null {
    const credentials = this.credentialsService.credential;
    return credentials ? credentials.payload.photoUrl : null;
  }

  get pageKeys(): string[] {
    return Object.keys(this.pages);
  }
}
