import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Header } from '../shared/header/header';
import { AuthService } from '../services/authservice';
import { UserService } from '../services/userservice';
import { User } from '../models/user';
import { UserProfile } from '../models/userprofile';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <app-header></app-header>
      <div class="profile-content">
        <h1>Profile</h1>
        <div *ngIf="currentUser">
          <div class="profile-card">
            <h2>User Information</h2>
            <p><strong>Name:</strong> {{ currentUser.firstName }} {{ currentUser.lastName }}</p>
            <p><strong>Email:</strong> {{ currentUser.email }}</p>
            <p><strong>Phone:</strong> {{ currentUser.phone || 'Not provided' }}</p>
            <p>
              <strong>Account Status:</strong> {{ currentUser.isActive ? 'Active' : 'Inactive' }}
            </p>
            <p><strong>Email Verified:</strong> {{ currentUser.emailVerified ? 'Yes' : 'No' }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        min-height: 100vh;
        background-color: #f5f5f5;
      }
      .profile-content {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      .profile-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
      }
      .profile-card h2 {
        margin-top: 0;
        color: #333;
      }
      .profile-card p {
        margin: 10px 0;
      }
    `,
  ],
  imports: [CommonModule, ReactiveFormsModule, Header],
})
export class Profile implements OnInit {
  currentUser: User | null = null;
  userProfile: UserProfile | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.loadUserProfile();
    }
  }

  private loadUserProfile() {
    if (this.currentUser) {
      this.userService.getUserProfile(this.currentUser.id).subscribe({
        next: (profile) => (this.userProfile = profile),
        error: (error) => console.error('Error loading profile:', error),
      });
    }
  }
}
