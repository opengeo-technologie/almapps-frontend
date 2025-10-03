import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormCompanyDetailComponent } from "../form-company-detail/form-company-detail.component";
import { ActivatedRoute } from "@angular/router";
import { CompanyDetailService } from "../../../services/company-detail.service";

@Component({
  selector: "app-edit-company-detail",
  imports: [FormCompanyDetailComponent, BaseComponent],
  standalone: true,
  templateUrl: "./edit-company-detail.component.html",
  styleUrl: "./edit-company-detail.component.css",
})
export class EditCompanyDetailComponent {
  company: any | undefined;

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

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyDetailService
  ) {}

  ngOnInit() {
    const id: string | null = this.route.snapshot.paramMap.get("id");
    if (id) {
      // console.log(clientId);
      this.companyService.getCompanyDetail(+id).subscribe((company) => {
        this.company = company;
      });
    } else {
      this.company = undefined;
    }
  }
}
