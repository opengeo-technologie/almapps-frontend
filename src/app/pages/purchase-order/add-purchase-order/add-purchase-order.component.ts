import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormPurchaseOrderComponent } from "../form-purchase-order/form-purchase-order.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-add-purchase-order",
  imports: [
    FormPurchaseOrderComponent,
    BaseComponent,
    FormsModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: "./add-purchase-order.component.html",
  styleUrl: "./add-purchase-order.component.css",
})
export class AddPurchaseOrderComponent {
  po: any = {
    reference: "",
    vendor: null,
    currency: null,
    user_id: 1,
    company_id: 1,
    date_op: null,
    amount: "",
    tva_status: false,
    discount_status: false,
    discount_percent: 0,
    shipping_status: false,
    shipping_amount: 0,
    shipping_terms: "",
    shipping_method: "",
    shipping_date: null,
    status: false,
    currency_used: "",
    locale_currency: "",
    on_delete: false,
    reason_delete: "",
  };

  submenus: any[] = [
    {
      url: "/Company-infos",
      name: "Company informations",
      icon: "information.svg",
    },
    {
      url: "/purchase-orders/list",
      name: "Purchase Order",
      icon: "requisition.svg",
    },
    {
      url: "/quotations/list",
      name: "Quotations",
      icon: "file-setting.svg",
    },
    {
      url: "/invoices/list",
      name: "Invoices",
      icon: "002-invoice.svg",
    },
  ];

  ngOnInit(): void {}
}
