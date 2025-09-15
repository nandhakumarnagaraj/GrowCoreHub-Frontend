import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
// Fix: Add all missing Material Design imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ProjectService } from '../../services/projectservice';
import { AuthService } from '../../services/authservice';
import { Project } from '../../models/project';
import { User } from '../../models/user';
import { Header } from '../../shared/header/header';
import { Loading } from '../../shared/loading/loading';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressBarModule,
    Header,
    Loading,
  ],
})
export class ProjectList implements OnInit {
  projects: Project[] = [];
  currentUser: User | null = null;
  loading = true;
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
  selectedCategory = '';
  categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'AI/ML',
    'DevOps',
    'Other',
  ];

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.projectService
      .getProjects(this.currentPage, this.pageSize, this.selectedCategory)
      .subscribe({
        next: (response) => {
          this.projects = response.projects;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading projects:', error);
          this.snackBar.open('Error loading projects', 'Close', { duration: 3000 });
          this.loading = false;
        },
      });
  }

  onCategoryChange() {
    this.currentPage = 0;
    this.loadProjects();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProjects();
  }

  viewProject(projectId: number) {
    this.router.navigate(['/projects', projectId]);
  }

  applyToProject(project: Project) {
    if (!this.currentUser) {
      this.snackBar.open('Please login to apply', 'Close', { duration: 3000 });
      return;
    }

    if (project.status !== 'ACTIVE') {
      this.snackBar.open('This project is not available for applications', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.projectService.applyToProject(project.id, this.currentUser.id).subscribe({
      next: (response) => {
        this.snackBar.open('Application submitted successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error applying to project:', error);
        const errorMessage = error.error?.message || 'Error submitting application';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return '#4caf50';
      case 'COMPLETED':
        return '#2196f3';
      case 'INACTIVE':
        return '#9e9e9e';
      default:
        return '#ff9800';
    }
  }

  getSkillsArray(skillsString: string): string[] {
    return skillsString ? skillsString.split(',').map((skill) => skill.trim()) : [];
  }
}
