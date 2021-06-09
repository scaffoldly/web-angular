import { Component, OnInit } from '@angular/core';
import { JwtService, ProviderDetail } from '@app/@openapi/auth';
import { map } from 'rxjs/operators';

type Logins = { [key: string]: ProviderDetail };

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
})
export class AccountDetailComponent implements OnInit {
  loading = true;
  logins: Logins = {};

  constructor(private jwtService: JwtService) {}

  ngOnInit(): void {
    this.jwtService
      .getLoginDetail()
      .pipe(map((loginDetail) => loginDetail.providers))
      .pipe(
        map((providers) => {
          return Object.entries(providers).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {} as Logins);
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
