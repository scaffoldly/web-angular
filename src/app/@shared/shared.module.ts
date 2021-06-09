import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { GoogleLoginComponent } from './google-login/google-login.component';
import { EmailLoginComponent } from './email-login/email-login.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileFormComponent } from './forms/profile-form/profile-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './forms/button/button.component';
import { VerificationCodeComponent } from './verification-code/verification-code.component';

@NgModule({
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FormsModule],
  declarations: [
    LoaderComponent,
    GoogleLoginComponent,
    EmailLoginComponent,
    ProfileFormComponent,
    VerificationCodeComponent,
    ButtonComponent,
  ],
  exports: [
    LoaderComponent,
    GoogleLoginComponent,
    EmailLoginComponent,
    VerificationCodeComponent,
    ProfileFormComponent,
  ],
})
export class SharedModule {}
