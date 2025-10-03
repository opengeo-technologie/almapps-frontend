import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  });

  constructor(private http: HttpClient, private router: Router) {}

  getVendors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vendors/`, {
      headers: this.headers,
    });
  }

  getVendor(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vendors/${id}`, {
      headers: this.headers,
    });
  }

  saveVendor(vendor: any) {
    return this.http.post<any>(`${this.apiUrl}/vendors/create/`, vendor, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updateVendor(vendor: any) {
    return this.http.put<any>(
      `${this.apiUrl}/vendors/update/${vendor.id}/`,
      vendor,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteVendor(vendor: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/vendors/delete/${vendor.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/`, {
      headers: this.headers,
    });
  }

  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`, {
      headers: this.headers,
    });
  }

  saveProduct(product: any) {
    return this.http.post<any>(`${this.apiUrl}/products/create/`, product, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  updateProduct(product: any) {
    return this.http.put<any>(
      `${this.apiUrl}/products/update/${product.id}/`,
      product,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteProduct(product: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/products/delete/${product.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  getProductsInputs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products-input/`, {
      headers: this.headers,
    });
  }

  saveProductInput(productInput: any) {
    return this.http.post<any>(
      `${this.apiUrl}/products-input/create/`,
      productInput,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deleteProductInput(productInput: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/products-input/delete/${productInput.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  getProductsOutputs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products-outputs/`, {
      headers: this.headers,
    });
  }
}
