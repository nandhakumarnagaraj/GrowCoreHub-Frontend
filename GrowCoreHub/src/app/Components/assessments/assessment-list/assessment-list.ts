import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssessmentService } from '../../services/assessmentservice';
import { AuthService } from '../../services/authservice';
import { Assessment } from '../../models/assessment';
import { UserAssessment } from '../../models/user-assessment';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assessment-list',
  imports:[CommonModule],
  templateUrl: './assessment-list.html',
  styleUrls: ['./assessment-list.css']
})
export class AssessmentList implements OnInit {
  assessments: Assessment[] = [];
  userAssessments: UserAssessment[] = [];
  currentUser: User | null = null;
  loading = true;

  constructor(
    private assessmentService: AssessmentService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.loadUserAssessments();
    }
  }

  loadUserAssessments() {
    if (!this.currentUser) return;

    this.assessmentService.getUserAssessments(this.currentUser.id).subscribe({
      next: (userAssessments) => {
        this.userAssessments = userAssessments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading assessments:', error);
        this.snackBar.open('Error loading assessments', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  takeAssessment(assessmentId: number) {
    this.router.navigate(['/assessments', assessmentId, 'take']);
  }

  hasCompletedAssessment(assessmentId: number): boolean {
    return this.userAssessments.some(ua => ua.assessment.id === assessmentId);
  }

  getAssessmentScore(assessmentId: number): number | null {
    const userAssessment = this.userAssessments.find(ua => ua.assessment.id === assessmentId);
    return userAssessment ? userAssessment.score : null;
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  }

  retakeAssessment(assessmentId: number) {
    this.takeAssessment(assessmentId);
  }
}