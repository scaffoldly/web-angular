import { Component, OnInit } from '@angular/core';
import { LoginPayload } from '@app/@shared/interfaces/authentication';
import { Providers } from '@app/@shared/interfaces/providers';
import { AccountService } from '@app/@shared/service/account.service';
import { AuthenticationService } from '@app/@shared/service/authentication.service';
import { map, mergeMap } from 'rxjs/operators';

type Logins = { [key: string]: { name: string; payload: LoginPayload } };

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
})
export class AccountDetailComponent implements OnInit {
  loading = true;
  logins: Logins = {};

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.providers
      .pipe(
        mergeMap((providers) => {
          return this.authenticationService.logins.pipe(
            map((logins) => {
              return Object.entries(providers).reduce((acc, [key, value]) => {
                acc[key] = { name: value.name, payload: logins[key] };
                return acc;
              }, {} as Logins);
            })
          );
        })
      )
      .subscribe((logins) => {
        this.loading = false;
        this.logins = logins;
      });
  }

  connect(provider: string): void {
    alert(`TODO:${provider}`);
    return;
  }
}
