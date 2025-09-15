import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Login } from './Components/auth/login/login';
import { Register } from './Components/auth/register/register';
import { Dashboard } from './Components/dashboard/dashboard';
import { ProjectList } from './Components/projects/project-list/project-list';
import { ProjectDetail } from './Components/projects/project-detail/project-detail';
import { AssessmentList } from './Components/assessments/assessment-list/assessment-list';
import { AssessmentTake } from './Components/assessments/assessment-take/assessment-take';
import { Profile } from './Components/profile'
import { AuthGuard } from './Components/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'projects', 
    component: ProjectList, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'projects/:id', 
    component: ProjectDetail, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'assessments', 
    component: AssessmentList, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'assessments/:id/take', 
    component: AssessmentTake, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile', 
    component: Profile, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
