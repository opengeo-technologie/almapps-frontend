import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ToolsService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  });

  constructor(private http: HttpClient, private router: Router) {}

  getTools(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tools/`, {
      headers: this.headers,
    });
  }

  getTool(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tools/${id}`, {
      headers: this.headers,
    });
  }

  saveTool(tool: any) {
    return this.http.post<any>(`${this.apiUrl}/tools/create/`, tool, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updateTool(tool: any) {
    return this.http.put<any>(`${this.apiUrl}/tools/update/${tool.id}/`, tool, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  deleteTool(tool: any) {
    return this.http.delete<any>(`${this.apiUrl}/tools/delete/${tool.id}/`, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  getToolOutputs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tools-output/`, {
      headers: this.headers,
    });
  }

  getToolOutput(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tools-output/${id}`, {
      headers: this.headers,
    });
  }

  saveToolOutput(tool: any) {
    return this.http.post<any>(`${this.apiUrl}/tools-output/create/`, tool, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updateToolOutput(tool: any) {
    return this.http.put<any>(
      `${this.apiUrl}/tools-output/update/${tool.id}/`,
      tool,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }
}
