import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
      map((response) => ({
        projects: response.projects,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        pageSize: response.pageSize,
      }))
    );
  }

  getProjectById(id: number): Observable<Project> {
    return this.http
      .get<ApiResponse<Project>>(`${this.apiUrl}/projects/${id}`)
      .pipe(map((response) => response.project));
  }

  applyToProject(projectId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/apply`, null, {
      params: { userId: userId.toString() },
    });
  }

  getUserApplications(userId: number): Observable<ProjectApplication[]> {
    return this.http
      .get<ApiResponse<ProjectApplication[]>>(`${this.apiUrl}/projects/user/${userId}/applications`)
      .pipe(map((response) => response.applications));
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http
      .post<ApiResponse<Project>>(`${this.apiUrl}/projects`, project)
      .pipe(map((response) => response.project));
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http
      .put<ApiResponse<Project>>(`${this.apiUrl}/projects/${id}`, project)
      .pipe(map((response) => response.project));
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${id}`);
  }
}
