// ✅ src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';
import { UserHomePage } from './pages/user/user-home/user-home';
import { UserProfilePage } from './pages/user/user-profile/user-profile';
import { EditProfilePage } from './pages/user/edit-profile/edit-profile';
import { AdminHomePage } from './pages/admin/admin-home/admin-home';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'user-home', component: UserHomePage, canActivate: [AuthGuard] },
  { path: 'user-profile', component: UserProfilePage, canActivate: [AuthGuard] },
  { path: 'edit-profile', component: EditProfilePage, canActivate: [AuthGuard] },
  { path: 'admin-home', component: AdminHomePage, canActivate: [AuthGuard] },
  //{ path: 'admin', component: AdminHomePage },
];
