import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormInvoiceComponent } from "../form-invoice/form-invoice.component";
import { ActivatedRoute, Router } from "@angular/router";
import { InvoiceService } from "../../../services/invoice.service";

@Component({
  selector: "app-edit-invoice",
  imports: [FormInvoiceComponent, BaseComponent, FormsModule, CommonModule],
  standalone: true,
  templateUrl: "./edit-invoice.component.html",
  styleUrl: "./edit-invoice.component.css",
})
export class EditInvoiceComponent {
  invoice: any | undefined;

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
    private apiService: InvoiceService
  ) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    const id_invoice: string | null = this.route.snapshot.paramMap.get("id");
    if (id_invoice) {
      // console.log(clientId);
      this.apiService.getInvoice(+id_invoice).subscribe((invoice) => {
        // console.log(invoice);
        this.invoice = invoice;
      });
    } else {
      this.invoice = undefined;
    }
  }
}
