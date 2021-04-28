import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Account } from '@app/@shared/interfaces/account';
import { AuthenticationService } from '@app/@shared/service/authentication.service';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.scss'],
})
export class AccountProfileComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    const { payload } = this.authenticationService;
    if (!payload) {
      return;
    }

    const { name, email } = payload;
    this.formGroup = new FormGroup({
      name: new FormControl(name, [Validators.required, Validators.minLength(3)]),
      email: new FormControl(email, [Validators.required, Validators.email]),
      company: new FormControl('', [Validators.minLength(3)]),
      updates: new FormControl(true),
    });
  }

  onUpdate(account: Account): void {}

  get photoUrl(): string | null {
    const { payload } = this.authenticationService;
    return payload ? payload.photoUrl : null;
  }
}
