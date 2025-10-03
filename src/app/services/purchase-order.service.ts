import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APP_CONSTANTS } from "../constants/app.constants";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PurchaseOrderService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    // Authorization: `Token ${localStorage.getItem("token")}`,
  });

  constructor(private http: HttpClient, private router: Router) {}

  getPurchaseOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/purchase_orders/`, {
      headers: this.headers,
    });
  }

  getPurchaseOrder(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/purchase_orders/${id}`, {
      headers: this.headers,
      observe: "response",
    });
  }

  generateNextReference(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/generate-code/next-reference-po/`,
      {
        headers: this.headers,
      }
    );
  }

  savePurchaseOrder(po: any) {
    return this.http.post<any>(`${this.apiUrl}/purchase_orders/create/`, po, {
      headers: this.headers,
      reportProgress: true,
      observe: "response",
    });
  }

  savePurchaseOrderProduct(po_product: any) {
    return this.http.post<any>(
      `${this.apiUrl}/purchase_order_products/create/`,
      po_product,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  updatePurchaseOrder(po: any) {
    return this.http.put<any>(
      `${this.apiUrl}/purchase_orders/update/${po.id}/`,
      po,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  updatePurchaseOrderProduct(po_product: any) {
    // console.log(po_product);
    return this.http.put<any>(
      `${this.apiUrl}/purchase_order_products/update/${po_product.id}/`,
      po_product,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deletePurchaseOrder(po: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/purchase_orders/delete/${po.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }

  deletePurchaseOrderProduct(po_prduct: any) {
    return this.http.delete<any>(
      `${this.apiUrl}/purchase_order_products/delete/${po_prduct.id}/`,
      {
        headers: this.headers,
        reportProgress: true,
        observe: "response",
      }
    );
  }
}
