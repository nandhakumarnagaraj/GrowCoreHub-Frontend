import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../shared/header/header';
import { AuthService } from '../services/authservice';
import { UserService } from '../services/userservice';
import { DashboardSummary } from '../models/dashboard-summary';
import { User } from '../models/user';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <app-header></app-header>
      <div class="dashboard-content">
        <h1>Welcome to Dashboard</h1>
        <div *ngIf="currentUser">
          <p>Hello, {{ currentUser.firstName }} {{ currentUser.lastName }}!</p>
        </div>
        <div *ngIf="summary">
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Total Applications</h3>
              <p>{{ summary.totalApplications }}</p>
            </div>
            <div class="stat-card">
              <h3>Completed Assessments</h3>
              <p>{{ summary.totalAssessments }}</p>
            </div>
            <div class="stat-card">
              <h3>Average Score</h3>
              <p>{{ summary.averageScore }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { min-height: 100vh; background-color: #f5f5f5; }
    .dashboard-content { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stat-card h3 { margin: 0 0 10px 0; color: #333; }
    .stat-card p { margin: 0; font-size: 2rem; font-weight: bold; color: #2196f3; }
  `],
  imports: [CommonModule, Header]
})
export class Dashboard implements OnInit {
  currentUser: User | null = null;
  summary: DashboardSummary | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.loadDashboardSummary();
    }
  }

  private loadDashboardSummary() {
    if (this.currentUser) {
      this.userService.getDashboardSummary(this.currentUser.id).subscribe({
        next: (summary) => this.summary = summary,
        error: (error) => console.error('Error loading dashboard summary:', error)
      });
    }
  }
}