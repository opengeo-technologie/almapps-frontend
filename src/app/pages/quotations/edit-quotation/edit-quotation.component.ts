import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormQuotationComponent } from "../form-quotation/form-quotation.component";
import { ActivatedRoute, Router } from "@angular/router";
import { QuotationService } from "../../../services/quotation.service";

@Component({
  selector: "app-edit-quotation",
  imports: [FormQuotationComponent, BaseComponent, FormsModule, CommonModule],
  standalone: true,
  templateUrl: "./edit-quotation.component.html",
  styleUrl: "./edit-quotation.component.css",
})
export class EditQuotationComponent {
  quotation: any | undefined;

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
    private router: Router,
    private route: ActivatedRoute,
    private apiService: QuotationService
  ) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    const id_quotation: string | null = this.route.snapshot.paramMap.get("id");
    if (id_quotation) {
      // console.log(clientId);
      this.apiService.getQuotation(+id_quotation).subscribe((quotation) => {
        // console.log(quotation);
        this.quotation = quotation.body;
      });
    } else {
      this.quotation = undefined;
    }
  }
}
