import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectListComponent } from './components/projects/project-list/project-list.component';
import { ProjectDetailComponent } from './components/projects/project-detail/project-detail.component';
import { AssessmentListComponent } from './components/assessments/assessment-list/assessment-list.component';
import { AssessmentTakeComponent } from './components/assessments/assessment-take/assessment-take.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'projects', 
    component: ProjectListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'projects/:id', 
    component: ProjectDetailComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'assessments', 
    component: AssessmentListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'assessments/:id/take', 
    component: AssessmentTakeComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }