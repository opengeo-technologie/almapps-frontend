import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormCompanyDetailComponent } from "../form-company-detail/form-company-detail.component";

@Component({
  selector: "app-add-company-detail",
  imports: [FormCompanyDetailComponent, BaseComponent],
  standalone: true,
  templateUrl: "./add-company-detail.component.html",
  styleUrl: "./add-company-detail.component.css",
})
export class AddCompanyDetailComponent {
  company: any = {
    name: "",
    address: "",
    email: "",
    phone: "",
    po_box: "",
    nui: "",
    rc: "",
    status: false,
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
