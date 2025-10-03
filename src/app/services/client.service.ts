import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    // accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Token ${localStorage.getItem("access_token")}`,
  });

  constructor(private http: HttpClient, private router: Router) {}

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients/`, {
      headers: this.headers,
    });
  }

  getClient(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clients/${id}`, {
      headers: this.headers,
    });
  }

  getTypeClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/client-types/`, {
      headers: this.headers,
    });
  }

  getTypeClient(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/client-types/${id}`, {
      headers: this.headers,
    });
  }

  getClientContact(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/contact-person/client/${id}`, {
      headers: this.headers,
    });
  }

  saveClient(client: any) {
    console.log(`URL: ${this.apiUrl}/clients/create/`);
    console.log(`client: ${client}`);
    console.log(`Header: ${this.headers}`);
    return this.http.post<any>(`${this.apiUrl}/clients/create/`, client, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  // saveClientFetch(body: any) {
  //   fetch(`${this.apiUrl}/clients/create/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer your_token_here", // optional
  //     },
  //     body: JSON.stringify(body),
  //   })
  //     .then((response) => {
  //       if (!response.ok) throw new Error("Network response was not ok");
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("POST response:", data);
  //     })
  //     .catch((error) => {
  //       console.error("POST error:", error);
  //     });
  // }

  saveClientContact(contact: any) {
    return this.http.post<any>(
      `${this.apiUrl}/contact-person/create/`,
      contact,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "events",
      }
    );
  }

  updateClientContact(contact: any) {
    return this.http.put<any>(
      `${this.apiUrl}/contact-person/update/${contact.id}/`,
      contact,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  updateClient(client: any) {
    return this.http.put<any>(
      `${this.apiUrl}/clients/update/${client.id}/`,
      client,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteClient(client: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/clients/delete/${client.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteClientContact(contact: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/contact-person/delete/${contact.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }
}
