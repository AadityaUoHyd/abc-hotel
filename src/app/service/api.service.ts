import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private static ENCRYPTION_KEY = 'aadi-key';

  constructor(private http: HttpClient) {}

  encryptAndSaveToStorage(key: string, value: string): void {
    const encryptedValue = CryptoJS.AES.encrypt(
        value,
        ApiService.ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(key, encryptedValue);
  }

  private getFromStorageAndDecrypt(key: string): string | null {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return CryptoJS.AES.decrypt(
          encryptedValue,
          ApiService.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error(`Error decrypting ${key}:`, error);
      return null;
    }
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  private getHeader(): HttpHeaders {
    const token = this.getFromStorageAndDecrypt('token');
    if (!token) {
      console.warn('No token found in storage');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  registerUser(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, body);
  }

  loginUser(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, body);
  }

  myProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/account`, {
      headers: this.getHeader()
    }).pipe(
        catchError((err) => {
          console.error('Error fetching profile:', err);
          return throwError(() => err);
        })
    );
  }

  myBookings(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/bookings`, {
      headers: this.getHeader()
    }).pipe(
        catchError((err) => {
          console.error('Error fetching bookings:', err);
          return throwError(() => err);
        })
    );
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/delete`, {
      headers: this.getHeader()
    }).pipe(
        catchError((err) => {
          console.error('Error deleting account:', err);
          return throwError(() => err);
        })
    );
  }

  addRoom(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rooms/add`, formData, {
      headers: this.getHeader()
    }).pipe(
        catchError((err) => {
          console.error('Error adding room:', err);
          return throwError(() => err);
        })
    );
  }

  updateRoom(formData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/rooms/update`, formData, {
      headers: this.getHeader()
    }).pipe(
        catchError((err) => {
          console.error('Error updating room:', err);
          return throwError(() => err);
        })
    );
  }

  getAvailableRooms(checkInDate: string, checkOutDate: string, roomType: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/rooms/available`, {
      params: { checkInDate, checkOutDate, roomType }
    }).pipe(
        catchError((err) => {
          console.error('Error fetching available rooms:', err);
          return throwError(() => err);
        })
    );
  }

  getRoomTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/rooms/types`).pipe(
        catchError((err) => {
          console.error('Error fetching room types:', err);
          return throwError(() => err);
        })
    );
  }

  getAllRooms(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/rooms/all`).pipe(
        catchError((err) => {
          console.error('Error fetching all rooms:', err);
          return throwError(() => err);
        })
    );
  }

  getRoomById(roomId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/rooms/${roomId}`).pipe(
        catchError((err) => {
          console.error('Error fetching room by ID:', err);
          return throwError(() => err);
        })
    );
  }

  deleteRoom(roomId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/rooms/delete/${roomId}`, {
      headers: this.getHeader()
    }).pipe(
        catchError((err) => {
          console.error('Error deleting room:', err);
          return throwError(() => err);
        })
    );
  }

  bookRoom(booking: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/bookings`, booking, {
      headers: this.getHeader()
    }).pipe(
      catchError((err) => {
        console.error('Error creating booking:', err);
        // Only log out if the error is 401 and the token is actually missing/expired
        const token = this.getFromStorageAndDecrypt('token');
        if (err.status === 401 && (!token || this.isTokenExpired(token))) {
          this.clearAuth();
          window.location.href = '/login';
        }
        // Otherwise, just propagate the error for UI handling
        return throwError(() => err);
      })
    );
  }

  // Helper to check token expiry (assumes JWT)
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp && (Date.now() / 1000) > payload.exp;
    } catch (e) {
      return true; // If parsing fails, treat as expired
    }
  }

  getAllBookings(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/bookings/all`, {
      headers: this.getHeader()
    }).pipe(
        catchError((err) => {
          console.error('Error fetching all bookings:', err);
          return throwError(() => err);
        })
    );
  }

  updateBooking(booking: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/bookings/update`, booking, {
      headers: this.getHeader()
    }).pipe(
        catchError((err) => {
          console.error('Error updating booking:', err);
          return throwError(() => err);
        })
    );
  }

  getBookingByReference(bookingCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/bookings/${bookingCode}`, {
      headers: this.getHeader()
    }).pipe(
      catchError((err) => {
        console.error('Error fetching booking by reference:', err);
        return throwError(() => err);
      })
    );
  }

  createRazorpayOrder(paymentData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/payments/create-order`, paymentData, {
      headers: this.getHeader()
    }).pipe(
      catchError((err) => {
        console.error('Error creating Razorpay order:', err);
        return throwError(() => err);
      })
    );
  }

  verifyRazorpayPayment(paymentData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/payments/verify`, paymentData, {
      headers: this.getHeader()
    }).pipe(
      catchError((err) => {
        console.error('Error verifying Razorpay payment:', err);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.clearAuth();
  }

  isAuthenticated(): boolean {
    const token = this.getFromStorageAndDecrypt('token');
    return !!token;
  }

  isAdmin(): boolean {
    const role = this.getFromStorageAndDecrypt('role');
    return role === 'ADMIN';
  }

  isCustomer(): boolean {
    const role = this.getFromStorageAndDecrypt('role');
    return role === 'CUSTOMER';
  }
}