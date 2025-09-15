import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../services/projectservice';
import { AuthService } from '../../services/authservice';
import { Project } from '../../models/project';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { Header } from "../../shared/header/header";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.html',
  imports: [CommonModule, Header, MatInputModule],
  styleUrls: ['./project-list.css'],
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
    if (!this.currentUser) return;

    this.projectService.applyToProject(project.id, this.currentUser.id).subscribe({
      next: (response) => {
        this.snackBar.open('Application submitted successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error applying to project:', error);
        this.snackBar.open('Error submitting application', 'Close', { duration: 3000 });
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'COMPLETED':
        return 'blue';
      case 'INACTIVE':
        return 'grey';
      default:
        return 'orange';
    }
  }
}
