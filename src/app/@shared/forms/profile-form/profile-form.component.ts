import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrentAccountService } from '@app/@shared/service/current-account.service';
import { AuthenticationService } from '@app/@shared/service/authentication.service';
import { ButtonComponent } from '../button/button.component';
import { AccountResponse } from '@app/@openapi/auth';

type Mode = 'create' | 'update';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  @Input() title: string | undefined;
  @Input() mode: Mode = 'update';
  @Output() onUpdate: EventEmitter<AccountResponse> = new EventEmitter();
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    company: new FormControl('', [Validators.minLength(3)]),
  });
  @ViewChild('submitButton') submitButton: ButtonComponent;

  constructor(
    private authenticationService: AuthenticationService,
    private currentAccountService: CurrentAccountService
  ) {}

  ngOnInit(): void {
    if (this.mode === 'create') {
      const { name, email } = this.authenticationService;

      this.formGroup.get('name').setValue(name);
      this.formGroup.get('email').setValue(email);
    }

    if (this.mode === 'update') {
      this.currentAccountService.get().subscribe((account) => {
        if (account) {
          const { name, email, company } = account;
          this.formGroup.get('name').setValue(name);
          this.formGroup.get('email').setValue(email);
          this.formGroup.get('company').setValue(company);
        }
      });
    }
  }

  submit() {
    if (!this.formGroup.valid) {
      throw new Error('The form is not valid');
    }

    if (this.mode === 'create') {
      this.currentAccountService
        .create({
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
      const { id } = this.authenticationService;
      if (!id) {
        throw new Error('ID is not set');
      }

      this.currentAccountService
        .update({
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
