import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Account } from '@app/@shared/interfaces/account';
import { CredentialsService } from '@app/@shared/service/credentials.service';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.scss'],
})
export class AccountProfileComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private credentialsService: CredentialsService) {}

  ngOnInit(): void {
    const { credential } = this.credentialsService;
    const { payload } = credential;
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
    const credentials = this.credentialsService.credential;
    return credentials ? credentials.payload.photoUrl : null;
  }
}
