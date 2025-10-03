import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormQuotationComponent } from "../form-quotation/form-quotation.component";

@Component({
  selector: "app-add-quotation",
  imports: [FormQuotationComponent, BaseComponent, FormsModule, CommonModule],
  standalone: true,
  templateUrl: "./add-quotation.component.html",
  styleUrl: "./add-quotation.component.css",
})
export class AddQuotationComponent {
  quotation: any = {
    reference: "",
    client: null,
    type: null,
    currency: null,
    user_id: 1,
    company_id: 1,
    date_op: null,
    amount: 0,
    tva_status: false,
    discount_status: false,
    discount_percent: 0,
    delivery_status: false,
    delivery_amount: 0,
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
