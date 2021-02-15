import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [CommonModule, TranslateModule, SignupRoutingModule, ReactiveFormsModule, SharedModule],
  declarations: [SignupComponent, BasicInfoComponent, TermsAndConditionsComponent],
})
export class SignupModule {}
