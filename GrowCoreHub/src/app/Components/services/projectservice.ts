import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { Project } from '../models/project';
import { ApiResponse } from '../models/api-response';
import { ProjectApplication } from '../models/project-application';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProjects(
    page: number = 0,
    size: number = 10,
    category?: string
  ): Observable<{
    projects: Project[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  }> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<any>(`${this.apiUrl}/projects`, { params }).pipe(
      map((response) => {
        // Handle different response structures
        const defaultResponse = {
          projects: [],
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          pageSize: size
        };

        // If response has the expected structure
        if (response.projects) {
          return {
            projects: response.projects || [],
            currentPage: response.currentPage || 0,
            totalPages: response.totalPages || 0,
            totalElements: response.totalElements || 0,
            pageSize: response.pageSize || size,
          };
        }

        // If response is directly an array
        if (Array.isArray(response)) {
          return {
            projects: response,
            currentPage: 0,
            totalPages: 1,
            totalElements: response.length,
            pageSize: size,
          };
        }

        // If response has data property
        if (response.data) {
          if (Array.isArray(response.data)) {
            return {
              projects: response.data,
              currentPage: 0,
              totalPages: 1,
              totalElements: response.data.length,
              pageSize: size,
            };
          }
          return { ...defaultResponse, ...response.data };
        }

        return defaultResponse;
      }),
      catchError(error => {
        console.error('Error fetching projects:', error);
        return throwError(() => error);
      })
    );
  }

  getProjectById(id: number): Observable<Project> {
    return this.http
      .get<any>(`${this.apiUrl}/projects/${id}`)
      .pipe(
        map((response) => {
          if (response.project) return response.project;
          if (response.data) return response.data;
          return response;
        }),
        catchError(error => {
          console.error('Error fetching project:', error);
          return throwError(() => error);
        })
      );
  }

  applyToProject(projectId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/apply`, null, {
      params: { userId: userId.toString() },
    }).pipe(
      catchError(error => {
        console.error('Error applying to project:', error);
        return throwError(() => error);
      })
    );
  }

  getUserApplications(userId: number): Observable<ProjectApplication[]> {
    return this.http
      .get<any>(`${this.apiUrl}/projects/user/${userId}/applications`)
      .pipe(
        map((response) => {
          if (response.applications) return response.applications;
          if (Array.isArray(response)) return response;
          if (response.data && Array.isArray(response.data)) return response.data;
          return [];
        }),
        catchError(error => {
          console.error('Error fetching user applications:', error);
          return throwError(() => error);
        })
      );
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http
      .post<any>(`${this.apiUrl}/projects`, project)
      .pipe(
        map((response) => {
          if (response.project) return response.project;
          if (response.data) return response.data;
          return response;
        }),
        catchError(error => {
          console.error('Error creating project:', error);
          return throwError(() => error);
        })
      );
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http
      .put<any>(`${this.apiUrl}/projects/${id}`, project)
      .pipe(
        map((response) => {
          if (response.project) return response.project;
          if (response.data) return response.data;
          return response;
        }),
        catchError(error => {
          console.error('Error updating project:', error);
          return throwError(() => error);
        })
      );
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting project:', error);
          return throwError(() => error);
        })
      );
  }
}