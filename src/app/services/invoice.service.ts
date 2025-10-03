import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InvoiceService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    // Authorization: `Token ${localStorage.getItem("token")}`,
  });

  constructor(private http: HttpClient, private router: Router) {}

  generateNextReference(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/generate-code/next-reference-invoice/`,
      {
        headers: this.headers,
      }
    );
  }

  getInvoiceTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invoices-types/`, {
      headers: this.headers,
    });
  }

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invoices/`, {
      headers: this.headers,
    });
  }

  getInvoice(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/invoices/${id}`, {
      headers: this.headers,
    });
  }

  saveInvoice(data: any) {
    return this.http.post<any>(`${this.apiUrl}/invoices/create/`, data, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updateInvoice(data: any) {
    return this.http.put<any>(
      `${this.apiUrl}/invoices/update/${data.id}/`,
      data,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteInvoice(client: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/invoices/delete/${client.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  saveInvoiceJob(data: any) {
    return this.http.post<any>(`${this.apiUrl}/invoices-jobs/create/`, data, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updateInvoiceJob(data: any) {
    return this.http.put<any>(
      `${this.apiUrl}/invoices-jobs/update/${data.id}/`,
      data,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteInvoiceJob(data: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/invoices-jobs/delete/${data.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  saveInvoiceProduct(data: any) {
    return this.http.post<any>(
      `${this.apiUrl}/invoices-products/create/`,
      data,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  updateInvoiceProduct(data: any) {
    return this.http.put<any>(
      `${this.apiUrl}/invoices-products/update/${data.id}/`,
      data,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteInvoiceProduct(data: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/invoices-products/delete/${data.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  saveInvoiceTechnician(data: any) {
    return this.http.post<any>(
      `${this.apiUrl}/invoices-technicians/create/`,
      data,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  updateInvoiceTechnician(data: any) {
    return this.http.put<any>(
      `${this.apiUrl}/invoices-technicians/update/${data.id}/`,
      data,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteInvoiceTechnician(data: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/invoices-technicians/delete/${data.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }
}
