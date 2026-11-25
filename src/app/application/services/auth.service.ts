import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://ceutec-wallet-api.azurewebsites.net/api/auth';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  register(data: RegisterRequest): Observable<unknown> {
    return this.http.post(`${API_URL}/register`, data);
  }

  verifyEmail(data: VerifyEmailRequest): Observable<unknown> {
    return this.http.post(`${API_URL}/verify-email`, data);
  }

  resendVerificationCode(email: string): Observable<unknown> {
    return this.http.post(`${API_URL}/resend-verification-code`, { email });
  }
}
