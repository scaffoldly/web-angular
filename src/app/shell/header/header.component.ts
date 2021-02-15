import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '@app/@shared/service/authentication.service';
import { CredentialsService } from '@app/@shared/service/credentials.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit() {}

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get id(): string | null {
    const credentials = this.credentialsService.credential;
    return credentials ? credentials.payload.id : null;
  }

  get name(): string | null {
    const credentials = this.credentialsService.credential;
    return credentials ? credentials.payload.name : null;
  }

  get photoUrl(): string | null {
    const credentials = this.credentialsService.credential;
    return credentials ? credentials.payload.photoUrl : null;
  }
}
