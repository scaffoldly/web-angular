import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Account } from '@app/@shared/interfaces/account';
import { AccountService } from '@app/@shared/service/account.service';
import { CredentialsService } from '@app/@shared/service/credentials.service';
import { ButtonComponent } from '../button/button.component';

type Mode = 'create' | 'update';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  @Input() title: string | undefined;
  @Input() mode: Mode = 'update';
  @Output() onUpdate: EventEmitter<Account> = new EventEmitter();
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    company: new FormControl('', [Validators.minLength(3)]),
  });
  @ViewChild('submitButton') submitButton: ButtonComponent;

  constructor(private credentialsService: CredentialsService, private accountService: AccountService) {}

  ngOnInit(): void {
    if (this.mode === 'create') {
      const { credential } = this.credentialsService;
      const { payload } = credential;
      const { name, email } = payload;
      this.formGroup.get('name').setValue(name);
      this.formGroup.get('email').setValue(email);
    }

    if (this.mode === 'update') {
      this.accountService.getAccount().subscribe((account) => {
        const { name, email, company } = account;
        this.formGroup.get('name').setValue(name);
        this.formGroup.get('email').setValue(email);
        this.formGroup.get('company').setValue(company);
      });
    }
  }

  submit() {
    if (!this.formGroup.valid) {
      throw new Error('The form is not valid');
    }

    if (this.mode === 'create') {
      this.accountService
        .createAccount({
          email: this.formGroup.get('email').value,
          name: this.formGroup.get('name').value,
          company: this.formGroup.get('company').value || undefined,
        })
        .subscribe((account) => {
          this.onUpdate.emit(account);
          this.submitButton.reset();
        });
    }

    if (this.mode === 'update') {
      this.accountService
        .updateAccount({
          name: this.formGroup.get('name').dirty ? this.formGroup.get('name').value : undefined,
          company: this.formGroup.get('company').dirty ? this.formGroup.get('company').value : undefined,
        })
        .subscribe((account) => {
          const { name, email, company } = account;
          this.formGroup.get('name').setValue(name);
          this.formGroup.get('email').setValue(email);
          this.formGroup.get('company').setValue(company);
          this.formGroup.markAsPristine();
          this.onUpdate.emit(account);
          this.submitButton.reset();
        });
    }
  }
}