import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TechnicianService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    // Authorization: `Token ${localStorage.getItem("token")}`,
  });

  constructor(private http: HttpClient, private router: Router) {}

  getTechRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/technicians_roles/`, {
      headers: this.headers,
    });
  }

  getTechRole(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/technicians_roles/${id}`, {
      headers: this.headers,
    });
  }

  getTechnicians(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/technicians/`, {
      headers: this.headers,
    });
  }

  getTechnician(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/technicians/${id}`, {
      headers: this.headers,
    });
  }

  saveTechnician(tech: any) {
    return this.http.post<any>(`${this.apiUrl}/technicians/create/`, tech, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updateTechnician(tech: any) {
    return this.http.put<any>(
      `${this.apiUrl}/technicians/update/${tech.id}/`,
      tech,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteTechnician(tech: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/technicians/delete/${tech.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }
}
