import { Injectable } from "@angular/core";
import { APP_CONSTANTS } from "../constants/app.constants";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ExpenseService {
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

  getExpenses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/expenses/`, {
      headers: this.headers,
    });
  }

  getExpense(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/expenses/${id}`, {
      headers: this.headers,
    });
  }

  saveExpense(data: any) {
    return this.http.post<any>(`${this.apiUrl}/expenses/create/`, data, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updateExpense(data: any) {
    return this.http.put<any>(
      `${this.apiUrl}/expenses/update/${data.id}/`,
      data,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteExpense(client: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/invoices/expenses/${client.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  saveExpenseTask(data: any) {
    return this.http.post<any>(`${this.apiUrl}/expense-tasks/create/`, data, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updateExpenseTask(data: any) {
    return this.http.put<any>(
      `${this.apiUrl}/expense-tasks/update/${data.id}/`,
      data,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteExpenseTask(data: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/expense-tasks/delete/${data.id}/`,
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

  getExpenseReportByYear(year: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/expenses/report-per-year/${year}`,
      {
        headers: this.headers,
      }
    );
  }

  getExpenseReportByMonth(month: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/expenses/report-per-month/${month}`,
      {
        headers: this.headers,
      }
    );
  }

  getExpenseReportByWeek(week: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/expenses/report-per-week/${week}`,
      {
        headers: this.headers,
      }
    );
  }
}
