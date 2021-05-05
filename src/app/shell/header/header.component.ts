import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '@app/@shared/interfaces/account';
import { AccountService } from '@app/@shared/service/account.service';
import { AuthenticationService } from '@app/@shared/service/authentication.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  appName: string = environment.envVars['APPLICATION_FRIENDLY_NAME'];
  id: string;
  name: string;
  company?: string;
  menuHidden = true;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.accountService.getCurrentAccount().subscribe((account: Account) => {
      if (account) {
        this.id = account.id;
        this.name = account.detail.name;
        this.company = account.detail.company;
      } else {
        this.id = null;
        this.name = null;
        this.company = null;
      }
    });
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get photoUrl(): string | null {
    const { payload } = this.authenticationService;
    return payload ? payload.photoUrl : null;
  }
}
