import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { AppleLoginComponent } from './apple-login/apple-login.component';
import { GoogleLoginComponent } from './google-login/google-login.component';
import { EmailLoginComponent } from './email-login/email-login.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileFormComponent } from './forms/profile-form/profile-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './forms/button/button.component';

@NgModule({
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  declarations: [
    LoaderComponent,
    GoogleLoginComponent,
    AppleLoginComponent,
    EmailLoginComponent,
    ProfileFormComponent,
    ButtonComponent,
  ],
  exports: [LoaderComponent, GoogleLoginComponent, AppleLoginComponent, EmailLoginComponent, ProfileFormComponent],
})
export class SharedModule {}
