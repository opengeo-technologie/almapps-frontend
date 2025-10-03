import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormInvoiceComponent } from "../form-invoice/form-invoice.component";

@Component({
  selector: "app-add-invoice",
  imports: [FormInvoiceComponent, BaseComponent, FormsModule, CommonModule],
  standalone: true,
  templateUrl: "./add-invoice.component.html",
  styleUrl: "./add-invoice.component.css",
})
export class AddInvoiceComponent {
  invoice: any = {
    reference: "",
    client: null,
    type: null,
    currency: null,
    purchase_order: null,
    user_id: 1,
    company_id: 1,
    date_op: null,
    amount: 0,
    tva_status: false,
    purchase_order_id: null,
    status: false,
    currency_used: "",
    locale_currency: "",
    heading: "",
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
