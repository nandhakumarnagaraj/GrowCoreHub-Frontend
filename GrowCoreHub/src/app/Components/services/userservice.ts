import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { User } from '../models/user';
import { ApiResponse } from '../models/api-response';
import { UserProfile } from '../models/userprofile';
import { DashboardSummary } from '../models/dashboard-summary';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`)
      .pipe(
        map(response => {
          if (response.user) return response.user;
          if (response.data) return response.data;
          return response;
        }),
        catchError(error => {
          console.error('Error fetching user:', error);
          return throwError(() => error);
        })
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<any>(`${this.apiUrl}/users`)
      .pipe(
        map(response => {
          if (response.users) return response.users;
          if (Array.isArray(response)) return response;
          if (response.data && Array.isArray(response.data)) return response.data;
          return [];
        }),
        catchError(error => {
          console.error('Error fetching users:', error);
          return throwError(() => error);
        })
      );
  }

  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}/profile`)
      .pipe(
        map(response => {
          if (response.profile) return response.profile;
          if (response.data) return response.data;
          return response;
        }),
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return throwError(() => error);
        })
      );
  }

  updateUserProfile(userId: number, profile: UserProfile): Observable<UserProfile> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}/profile`, profile)
      .pipe(
        map(response => {
          if (response.profile) return response.profile;
          if (response.data) return response.data;
          return response;
        }),
        catchError(error => {
          console.error('Error updating user profile:', error);
          return throwError(() => error);
        })
      );
  }

  updateUser(userId: number, user: Partial<User>): Observable<User> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, user)
      .pipe(
        map(response => {
          if (response.user) return response.user;
          if (response.data) return response.data;
          return response;
        }),
        catchError(error => {
          console.error('Error updating user:', error);
          return throwError(() => error);
        })
      );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting user:', error);
          return throwError(() => error);
        })
      );
  }

  getDashboardSummary(userId: number): Observable<DashboardSummary> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/summary/${userId}`)
      .pipe(
        map(response => {
          if (response.summary) return response.summary;
          if (response.data) return response.data;
          return response;
        }),
        catchError(error => {
          console.error('Error fetching dashboard summary:', error);
          return throwError(() => error);
        })
      );
  }

  getUserPerformance(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/performance/${userId}`)
      .pipe(
        map(response => {
          if (response.performance) return response.performance;
          if (response.data) return response.data;
          return response;
        }),
        catchError(error => {
          console.error('Error fetching user performance:', error);
          return throwError(() => error);
        })
      );
  }

  getRecentActivity(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/recent-activity/${userId}`)
      .pipe(
        map(response => {
          if (response.activity) return response.activity;
          if (response.data) return response.data;
          return response;
        }),
        catchError(error => {
          console.error('Error fetching recent activity:', error);
          return throwError(() => error);
        })
      );
  }
}