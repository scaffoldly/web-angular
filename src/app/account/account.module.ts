import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [CommonModule, TranslateModule, AccountRoutingModule, ReactiveFormsModule, SharedModule],
  exports: [ReactiveFormsModule],
  declarations: [AccountComponent, AccountDetailComponent, AccountProfileComponent],
})
export class AccountModule {}
