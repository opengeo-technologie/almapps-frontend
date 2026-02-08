import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class JobsService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    // Authorization: `Token ${localStorage.getItem("token")}`,
  });

  constructor(private http: HttpClient, private router: Router) {}

  // Job management

  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs/`, {
      headers: this.headers,
    });
  }

  getJob(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/jobs/${id}`, {
      headers: this.headers,
    });
  }

  getJobsByStatus(status: boolean): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs/${status}/`, {
      headers: this.headers,
    });
  }

  saveJob(job: any) {
    return this.http.post<any>(`${this.apiUrl}/jobs/create/`, job, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updateJob(job: any) {
    return this.http.put<any>(`${this.apiUrl}/jobs/update/${job.id}/`, job, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  deleteJob(data: any) {
    return this.http.delete<any>(`${this.apiUrl}/jobs/delete/${data.id}/`, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  // Job Assign management
  getJobsAssigned(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs_assign/`, {
      headers: this.headers,
    });
  }

  getJobsAssignedByStatus(status: boolean): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs_assign/filter/${status}`, {
      headers: this.headers,
    });
  }

  getJobAssignTechnicians(job_id: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/jobs_assign/technicians/${job_id}`,
      {
        headers: this.headers,
      }
    );
  }

  saveJobAssignTechnician(job_assign: any) {
    return this.http.post<any>(
      `${this.apiUrl}/jobs_assign/create/`,
      job_assign,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteJobAssignTechnician(job_id: number, technician_id: number) {
    return this.http.delete<any>(
      `${this.apiUrl}/jobs_assign/delete/${job_id}/${technician_id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }
}
