import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { Assessment } from '../models/assessment';
import { ApiResponse } from '../models/api-response';
import { Answer } from '../models/answer';
import { UserAssessment } from '../models/user-assessment';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAssessmentsByProject(projectId: number): Observable<Assessment[]> {
    return this.http.get<any>(`${this.apiUrl}/assessments/project/${projectId}`).pipe(
      map((response) => {
        // Handle different possible response structures
        if (response.assessments) return response.assessments;
        if (Array.isArray(response)) return response;
        if (response.data && Array.isArray(response.data)) return response.data;
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching assessments by project:', error);
        return throwError(() => error);
      })
    );
  }

  getAssessmentById(id: number): Observable<Assessment> {
    return this.http.get<any>(`${this.apiUrl}/assessments/${id}`).pipe(
      map((response) => {
        // Handle different possible response structures
        if (response.assessment) return response.assessment;
        if (response.data) return response.data;
        return response;
      }),
      catchError((error) => {
        console.error('Error fetching assessment:', error);
        return throwError(() => error);
      })
    );
  }

  submitAssessment(assessmentId: number, userId: number, answers: Answer): Observable<any> {
    const submissionData = {
      answers: JSON.stringify(answers),
    };

    return this.http
      .post(`${this.apiUrl}/assessments/${assessmentId}/submit`, submissionData, {
        params: { userId: userId.toString() },
      })
      .pipe(
        catchError((error) => {
          console.error('Error submitting assessment:', error);
          return throwError(() => error);
        })
      );
  }

  getUserAssessments(userId: number): Observable<UserAssessment[]> {
    return this.http.get<any>(`${this.apiUrl}/assessments/user/${userId}`).pipe(
      map((response) => {
        // Handle different possible response structures
        if (response.userAssessments) return response.userAssessments;
        if (response.assessments) return response.assessments;
        if (Array.isArray(response)) return response;
        if (response.data && Array.isArray(response.data)) return response.data;
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching user assessments:', error);
        return throwError(() => error);
      })
    );
  }

  getAssessmentResult(userId: number, assessmentId: number): Observable<UserAssessment> {
    return this.http.get<any>(`${this.apiUrl}/assessments/result/${userId}/${assessmentId}`).pipe(
      map((response) => {
        if (response.result) return response.result;
        if (response.data) return response.data;
        return response;
      }),
      catchError((error) => {
        console.error('Error fetching assessment result:', error);
        return throwError(() => error);
      })
    );
  }

  getAssessmentStatistics(assessmentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/assessments/${assessmentId}/statistics`).pipe(
      map((response) => {
        if (response.statistics) return response.statistics;
        if (response.data) return response.data;
        return response;
      }),
      catchError((error) => {
        console.error('Error fetching assessment statistics:', error);
        return throwError(() => error);
      })
    );
  }

  parseQuestions(questionsJson: string): Question[] {
    try {
      return JSON.parse(questionsJson);
    } catch (error) {
      console.error('Error parsing questions JSON:', error);
      return [];
    }
  }

  parseAnswers(answersJson: string): Answer {
    try {
      return JSON.parse(answersJson);
    } catch (error) {
      console.error('Error parsing answers JSON:', error);
      return {};
    }
  }

  createAssessment(assessment: Partial<Assessment>): Observable<Assessment> {
    return this.http.post<any>(`${this.apiUrl}/assessments`, assessment).pipe(
      map((response) => {
        if (response.assessment) return response.assessment;
        if (response.data) return response.data;
        return response;
      }),
      catchError((error) => {
        console.error('Error creating assessment:', error);
        return throwError(() => error);
      })
    );
  }

  deleteAssessment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/assessments/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting assessment:', error);
        return throwError(() => error);
      })
    );
  }

  // Test endpoints
  createSampleJavaAssessment(projectId: number): Observable<Assessment> {
    return this.http
      .post<any>(`${this.apiUrl}/assessment-test/create-sample-java/${projectId}`, {})
      .pipe(
        map((response) => {
          if (response.assessment) return response.assessment;
          if (response.data) return response.data;
          return response;
        }),
        catchError((error) => {
          console.error('Error creating sample assessment:', error);
          return throwError(() => error);
        })
      );
  }

  submitSampleAnswers(
    assessmentId: number,
    userId: number,
    quality: 'perfect' | 'good' | 'poor' = 'good'
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/assessment-test/submit-sample-answers/${assessmentId}`, null, {
        params: {
          userId: userId.toString(),
          answerQuality: quality,
        },
      })
      .pipe(
        catchError((error) => {
          console.error('Error submitting sample answers:', error);
          return throwError(() => error);
        })
      );
  }
}
