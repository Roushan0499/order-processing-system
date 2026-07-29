import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5000/api/orders';

  // ==========================
  // Orders
  // ==========================

  getOrders(): Observable<any[]> {

    return this.http.get<any[]>(this.apiUrl);

  }

  getOrder(orderId: string): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${orderId}`
    );

  }

  // ==========================
  // Upload Orders CSV
  // ==========================

  uploadOrders(file: File): Observable<any> {

    const formData = new FormData();

    formData.append('file', file);

    return this.http.post(

      `${this.apiUrl}/upload/orders`,

      formData

    );

  }

  // ==========================
  // Upload Inventory CSV
  // ==========================

  uploadInventory(file: File): Observable<any> {

    const formData = new FormData();

    formData.append('file', file);

    return this.http.post(

      `${this.apiUrl}/upload/inventory`,

      formData

    );

  }

  // ==========================
  // Retry Compensation
  // ==========================

  retryOrder(orderId: string): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/${orderId}/retry`,

      {}

    );

  }

  // ==========================
  // Mark Shipped
  // ==========================

  markShipped(orderId: string): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/${orderId}/shipped`,

      {}

    );

  }

  // ==========================
  // Fetch Inventorry
  // ==========================

  getInventory(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/inventory`
    );

  }

}