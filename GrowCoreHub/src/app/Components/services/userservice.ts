import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/${id}`)
      .pipe(
        map(response => response.user)
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`)
      .pipe(
        map(response => response.users)
      );
  }

  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/users/${userId}/profile`)
      .pipe(
        map(response => response.profile)
      );
  }

  updateUserProfile(userId: number, profile: UserProfile): Observable<UserProfile> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.apiUrl}/users/${userId}/profile`, profile)
      .pipe(
        map(response => response.profile)
      );
  }

  updateUser(userId: number, user: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/users/${userId}`, user)
      .pipe(
        map(response => response.user)
      );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  getDashboardSummary(userId: number): Observable<DashboardSummary> {
    return this.http.get<ApiResponse<DashboardSummary>>(`${this.apiUrl}/dashboard/summary/${userId}`)
      .pipe(
        map(response => response.summary)
      );
  }

  getUserPerformance(userId: number): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/dashboard/performance/${userId}`)
      .pipe(
        map(response => response.performance)
      );
  }

  getRecentActivity(userId: number): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/dashboard/recent-activity/${userId}`)
      .pipe(
        map(response => response.activity)
      );
  }
}