import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LegalComponent } from './legal/legal.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { AccountChangePasswordComponent } from './profile-page/account-change-password/account-change-password.component';
import { AccountConnectionsComponent } from './profile-page/account-connections/account-connections.component';
import { AccountInfoComponent } from './profile-page/account-info/account-info.component';
import { AccountNotificationsComponent } from './profile-page/account-notifications/account-notifications.component';
import { AccountSocialLinksComponent } from './profile-page/account-social-links/account-social-links.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'legal', component: LegalComponent},
    { path: 'profile', component: ProfilePageComponent},
    { path: 'profile/change-password', component: AccountChangePasswordComponent},
    { path: 'profile/account-connections', component: AccountConnectionsComponent},
    { path: 'profile/account-info', component: AccountInfoComponent},
    { path: 'profile/account-notifications', component: AccountNotificationsComponent},
    { path: 'profile/account-social-links', component: AccountSocialLinksComponent},
    { path: '**', redirectTo: ''},
];
