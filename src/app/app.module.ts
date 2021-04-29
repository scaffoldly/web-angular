import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { LoginModule } from '@app/login/login.module';
import { AuthModule } from '@app/@shared/auth';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AboutModule } from './about/about.module';
import { SignupModule } from './signup/signup.module';
import { AccountModule } from './account/account.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GoogleLoginProvider, LoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { GlobalErrorHandler } from './global-error-handler';
import { environment } from '@env/environment';

export type SocialLoginProvider = {
  id: string;
  provider: LoginProvider;
};

const loginProviders = (): SocialLoginProvider[] => {
  const providers: SocialLoginProvider[] = [];
  if (environment.envVars['GOOGLE_CLIENT_ID']) {
    providers.push({
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.envVars['GOOGLE_CLIENT_ID']),
    });
  }
  return providers;
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    NgbModule,
    CoreModule,
    SharedModule,
    LoginModule,
    ShellModule,
    HomeModule,
    AboutModule,
    SignupModule,
    AccountModule,
    AuthModule,
    SocialLoginModule,
    FontAwesomeModule,
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: loginProviders(),
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
