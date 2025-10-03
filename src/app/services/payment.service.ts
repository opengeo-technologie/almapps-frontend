import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    // Authorization: `Token ${localStorage.getItem("token")}`,
  });

  constructor(private http: HttpClient, private router: Router) {}

  generateNextReference(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/generate-code/next-reference-payment/`,
      {
        headers: this.headers,
      }
    );
  }

  getPaymentMethods(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payment-methods/`, {
      headers: this.headers,
    });
  }

  getPaymentMethod(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payment-methods/${id}`, {
      headers: this.headers,
    });
  }

  getInvoicesPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payments/invoices/all`, {
      headers: this.headers,
    });
  }

  getInvoicesPaymentById(id: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/payments/invoices/all/${id}`, {
      headers: this.headers,
    });
  }

  getPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payments/`, {
      headers: this.headers,
    });
  }

  getPayment(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payments/${id}`, {
      headers: this.headers,
    });
  }

  savePayment(tech: any) {
    return this.http.post<any>(`${this.apiUrl}/payments/create/`, tech, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updatePayment(tech: any) {
    return this.http.put<any>(
      `${this.apiUrl}/payments/update/${tech.id}/`,
      tech,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deletePayment(tech: any) {
    return this.http.delete<any>(`${this.apiUrl}/payments/delete/${tech.id}/`, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }
}
