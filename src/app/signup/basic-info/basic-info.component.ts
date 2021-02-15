import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '@app/@shared/service/account.service';
import { CredentialsService } from '@app/@shared/service/credentials.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnInit {
  @Output() onNext: EventEmitter<any> = new EventEmitter();
  formGroup: FormGroup;
  constructor(
    private router: Router,
    private credentialsService: CredentialsService,
    private accountService: AccountService
  ) {}

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

  submit() {
    if (!this.formGroup.valid) {
      throw new Error('The form is not valid');
    }

    this.accountService
      .createAccount({
        email: this.formGroup.get('email').value,
        name: this.formGroup.get('name').value,
        company: this.formGroup.get('company').value || undefined,
      })
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }
}
