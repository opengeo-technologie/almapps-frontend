import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CashRegisterService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  });

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getCashRegisters(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cash/register/history`, {
      headers: this.headers,
    });
  }

  getCashRegister(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cash/register/${id}`, {
      headers: this.headers,
    });
  }

  getCashRegisterTransactions(register_id: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/cash/transactions/register/${register_id}`,
      {
        headers: this.headers,
      },
    );
  }

  getOpenedCashRegister(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cash/register/current`, {
      headers: this.headers,
    });
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cash/transactions`, {
      headers: this.headers,
    });
  }

  getTransaction(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cash/transaction/${id}`, {
      headers: this.headers,
    });
  }

  saveDailyCashDesk(data: any) {
    return this.http.post<any>(`${this.apiUrl}/cash/register/open`, data, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  saveTransaction(transaction: any) {
    return this.http.post<any>(
      `${this.apiUrl}/cash/register/transaction/`,
      transaction,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      },
    );
  }

  updateTransaction(data: any) {
    return this.http.put<any>(
      `${this.apiUrl}/cash/transactions/update/${data.id}/`,
      data,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      },
    );
  }

  deleteTransaction(data: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/cash/transactions/delete/${data.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      },
    );
  }

  openRegister(opening_balance: number) {
    return this.http
      .post<any>(
        `${this.apiUrl}/cash/register/open`,
        {},
        {
          headers: this.headers,
          reportProgress: true,
          observe: "response",
        },
      )
      .pipe(
        catchError(this.handleError), // Handle HTTP errors
      );
  }

  reopenRegister(register_id: number) {
    return this.http
      .put<any>(
        `${this.apiUrl}/cash/register/${register_id}/reopen`,
        {},
        {
          headers: this.headers,
          reportProgress: true,
          observe: "response",
        },
      )
      .pipe(
        catchError(this.handleError), // Handle HTTP errors
      );
  }

  closeRegister(closing_balance: number) {
    let payload = {
      closing_balance: closing_balance,
    };
    return this.http.post<any>(
      `${this.apiUrl}/cash/register/close?user_id=1`,
      payload,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      },
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error("Client error:", error.error.message);
    } else {
      // Server-side error (from FastAPI)
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    }

    // Return a user-friendly message
    return throwError(
      () =>
        new Error(
          error.error.detail || "Erreur lors de l’ouverture de la caisse.",
        ),
    );
  }
}
