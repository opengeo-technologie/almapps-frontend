import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    // Authorization: `Token ${localStorage.getItem("token")}`,
  });

  constructor(private http: HttpClient, private router: Router) {}

  getUserProfiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profiles/`, {
      headers: this.headers,
    });
  }

  getUserProfile(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profiles/${id}`, {
      headers: this.headers,
    });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/`, {
      headers: this.headers,
    });
  }

  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`, {
      headers: this.headers,
    });
  }

  saveUser(tech: any) {
    return this.http.post<any>(`${this.apiUrl}/users/create/`, tech, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  resetUserPassword(user: any) {
    return this.http.put<any>(
      `${this.apiUrl}/users/password/${user.id}/`,
      user,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  updateUser(tech: any) {
    return this.http.put<any>(`${this.apiUrl}/users/update/${tech.id}/`, tech, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
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
