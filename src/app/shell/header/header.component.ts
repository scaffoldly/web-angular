import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountResponse } from '@app/@openapi/auth';
import { AuthenticationService } from '@app/@shared/service/authentication.service';
import { CurrentAccountService } from '@app/@shared/service/current-account.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  appName: string = environment.envVars['APPLICATION_FRIENDLY_NAME'];
  account: AccountResponse;
  email: string;
  name: string;
  company?: string;
  menuHidden = true;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private currentAccountService: CurrentAccountService
  ) {}

  ngOnInit() {
    this.currentAccountService.get().subscribe(
      (account: AccountResponse) => {
        if (account) {
          this.account = account;
          this.email = account.email;
          this.name = account.name;
          this.company = account.company;
        } else {
          this.account = null;
          this.email = null;
          this.name = null;
          this.company = null;
        }
      },
      () => {
        this.account = null;
        this.email = null;
        this.name = null;
        this.company = null;
      }
    );
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get photoUrl(): string {
    return this.authenticationService.photoUrl;
  }
}
