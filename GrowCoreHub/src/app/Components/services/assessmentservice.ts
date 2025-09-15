import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroment';
import { Assessment } from '../models/assessment';
import { ApiResponse } from '../models/api-response';
import { Answer } from '../models/answer';
import { UserAssessment } from '../models/user-assessment';
import { Question } from '../models/question';


@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAssessmentsByProject(projectId: number): Observable<Assessment[]> {
    return this.http.get<ApiResponse<Assessment[]>>(`${this.apiUrl}/assessments/project/${projectId}`)
      .pipe(
        map(response => response.assessments)
      );
  }

  getAssessmentById(id: number): Observable<Assessment> {
    return this.http.get<ApiResponse<Assessment>>(`${this.apiUrl}/assessments/${id}`)
      .pipe(
        map(response => response.assessment)
      );
  }

  submitAssessment(assessmentId: number, userId: number, answers: Answer): Observable<any> {
    const submissionData = {
      answers: JSON.stringify(answers)
    };
    
    return this.http.post(`${this.apiUrl}/assessments/${assessmentId}/submit`, submissionData, {
      params: { userId: userId.toString() }
    });
  }

  getUserAssessments(userId: number): Observable<UserAssessment[]> {
    return this.http.get<ApiResponse<UserAssessment[]>>(`${this.apiUrl}/assessments/user/${userId}`)
      .pipe(
        map(response => response.userAssessments)
      );
  }

  getAssessmentResult(userId: number, assessmentId: number): Observable<UserAssessment> {
    return this.http.get<ApiResponse<UserAssessment>>(`${this.apiUrl}/assessments/result/${userId}/${assessmentId}`)
      .pipe(
        map(response => response.result)
      );
  }

  getAssessmentStatistics(assessmentId: number): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/assessments/${assessmentId}/statistics`)
      .pipe(
        map(response => response.statistics)
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
    return this.http.post<ApiResponse<Assessment>>(`${this.apiUrl}/assessments`, assessment)
      .pipe(
        map(response => response.assessment)
      );
  }

  deleteAssessment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/assessments/${id}`);
  }

  // Test endpoints
  createSampleJavaAssessment(projectId: number): Observable<Assessment> {
    return this.http.post<ApiResponse<Assessment>>(`${this.apiUrl}/assessment-test/create-sample-java/${projectId}`, {})
      .pipe(
        map(response => response.assessment)
      );
  }

  submitSampleAnswers(assessmentId: number, userId: number, quality: 'perfect' | 'good' | 'poor' = 'good'): Observable<any> {
    return this.http.post(`${this.apiUrl}/assessment-test/submit-sample-answers/${assessmentId}`, null, {
      params: { 
        userId: userId.toString(),
        answerQuality: quality
      }
    });
  }
}