import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CompanyDetailService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    // Authorization: `Token ${localStorage.getItem("token")}`,
  });

  constructor(private http: HttpClient, private router: Router) {}

  getCompanyDetails(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/company-detail/`, {
      headers: this.headers,
    });
  }

  getCompanyDetail(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/company-detail/${id}`, {
      headers: this.headers,
    });
  }

  getActiveCompanyDetail(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/company-detail/company/activated`,
      {
        headers: this.headers,
      }
    );
  }

  saveCompanyDetail(data: any) {
    return this.http.post<any>(`${this.apiUrl}/company-detail/create/`, data, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updateCompanyDetail(data: any) {
    return this.http.put<any>(
      `${this.apiUrl}/company-detail/update/${data.id}/`,
      data,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteCompanyDetail(client: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/company-detail/delete/${client.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }
}
