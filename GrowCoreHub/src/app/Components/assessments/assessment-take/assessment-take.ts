import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
// Fix: Add missing Material Design imports
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AssessmentService } from '../../services/assessmentservice';
import { AuthService } from '../../services/authservice';
import { Assessment } from '../../models/assessment';
import { Question } from '../../models/question';
import { Answer } from '../../models/answer';
import { User } from '../../models/user';
import { Loading } from '../../shared/loading/loading';
import { Header } from '../../shared/header/header';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assessment-take',
  templateUrl: './assessment-take.html',
  styleUrls: ['./assessment-take.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    Loading,
    Header,
  ],
})
export class AssessmentTake implements OnInit, OnDestroy {
  assessment: Assessment | null = null;
  questions: Question[] = [];
  answers: Answer = {};
  currentUser: User | null = null;
  currentQuestionIndex = 0;
  timeRemaining = 0;
  timer: any;
  loading = true;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    const assessmentId = Number(this.route.snapshot.paramMap.get('id'));

    if (assessmentId) {
      this.loadAssessment(assessmentId);
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  loadAssessment(assessmentId: number) {
    this.assessmentService.getAssessmentById(assessmentId).subscribe({
      next: (assessment) => {
        this.assessment = assessment;
        this.questions = this.assessmentService.parseQuestions(assessment.questions);
        this.timeRemaining = assessment.timeLimitMinutes * 60;
        this.startTimer();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading assessment:', error);
        this.snackBar.open('Error loading assessment', 'Close', { duration: 3000 });
        this.router.navigate(['/assessments']);
      },
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.submitAssessment();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getCurrentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  selectAnswer(questionId: string, answer: string) {
    this.answers[questionId] = answer;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
  }

  isAnswered(questionId: string): boolean {
    return !!this.answers[questionId];
  }

  getAnsweredCount(): number {
    return Object.keys(this.answers).length;
  }

  canSubmit(): boolean {
    return this.getAnsweredCount() === this.questions.length;
  }

  submitAssessment() {
    if (!this.assessment || !this.currentUser) return;

    this.submitting = true;
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.assessmentService
      .submitAssessment(this.assessment.id, this.currentUser.id, this.answers)
      .subscribe({
        next: (response) => {
          this.snackBar.open('Assessment submitted successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/assessments']);
        },
        error: (error) => {
          console.error('Error submitting assessment:', error);
          this.snackBar.open('Error submitting assessment', 'Close', { duration: 3000 });
          this.submitting = false;
        },
      });
  }

  onSubmitClick() {
    if (this.canSubmit()) {
      this.submitAssessment();
    } else {
      this.snackBar.open('Please answer all questions before submitting', 'Close', {
        duration: 3000,
      });
    }
  }
}
