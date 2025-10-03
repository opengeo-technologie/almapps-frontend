import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class QuotationService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    // Authorization: `Token ${localStorage.getItem("token")}`,
  });

  constructor(private http: HttpClient, private router: Router) {}

  getQuotationTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/quotations_types/`, {
      headers: this.headers,
    });
  }

  getQuotations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/quotations/`, {
      headers: this.headers,
    });
  }

  getQuotation(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/quotations/${id}`, {
      headers: this.headers,
      observe: "response",
    });
  }

  generateNextReference(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/generate-code/next-reference-pro/`,
      {
        headers: this.headers,
      }
    );
  }

  saveQuotation(quotation: any) {
    return this.http.post<any>(`${this.apiUrl}/quotations/create/`, quotation, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  saveQuotationProduct(pro_product: any) {
    return this.http.post<any>(
      `${this.apiUrl}/quotations_products/create/`,
      pro_product,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  saveQuotationService(pro_service: any) {
    return this.http.post<any>(
      `${this.apiUrl}/quotations_services/create/`,
      pro_service,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  updateQuotation(po: any) {
    return this.http.put<any>(
      `${this.apiUrl}/quotations/update/${po.id}/`,
      po,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  updateQuotationProduct(pro_product: any) {
    // console.log(po_product);
    return this.http.put<any>(
      `${this.apiUrl}/quotations_products/update/${pro_product.id}/`,
      pro_product,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  updateQuotationService(pro_product: any) {
    // console.log(po_product);
    return this.http.put<any>(
      `${this.apiUrl}/quotations_services/update/${pro_product.id}/`,
      pro_product,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteQuotation(pro: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/quotations/delete/${pro.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteQuotationProduct(pro_prduct: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/quotations_products/delete/${pro_prduct.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteQuotationService(pro_prduct: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/quotations_services/delete/${pro_prduct.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }
}
