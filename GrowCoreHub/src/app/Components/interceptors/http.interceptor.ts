import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor as HttpInterceptorInterface, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HttpInterceptor implements HttpInterceptorInterface {
  
  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth token if available
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      // If you have a token system, add it here
      // const token = localStorage.getItem('authToken');
      // if (token) {
      //   request = request.clone({
      //     setHeaders: {
      //       Authorization: `Bearer ${token}`
      //     }
      //   });
      // }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - redirect to login
          localStorage.removeItem('currentUser');
          this.router.navigate(['/login']);
          this.snackBar.open('Session expired. Please login again.', 'Close', {
            duration: 3000
          });
        } else if (error.status === 403) {
          // Forbidden
          this.snackBar.open('Access denied', 'Close', {
            duration: 3000
          });
        } else if (error.status === 500) {
          // Server error
          this.snackBar.open('Server error. Please try again later.', 'Close', {
            duration: 3000
          });
        }

        return throwError(error);
      })
    );
  }
}