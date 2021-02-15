import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from './login.component';
import { I18nModule } from '@app/i18n';
import { AuthRoutingModule } from '@app/@shared/auth/auth-routing.module';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, NgbModule, I18nModule, AuthRoutingModule, SharedModule],
  declarations: [LoginComponent],
})
export class LoginModule {}
