import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormPurchaseOrderComponent } from "../form-purchase-order/form-purchase-order.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PurchaseOrderService } from "../../../services/purchase-order.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-edit-purchase-order",
  imports: [
    FormPurchaseOrderComponent,
    BaseComponent,
    FormsModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: "./edit-purchase-order.component.html",
  styleUrl: "./edit-purchase-order.component.css",
})
export class EditPurchaseOrderComponent {
  po: any | undefined;

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
    private apiService: PurchaseOrderService
  ) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    const id_po: string | null = this.route.snapshot.paramMap.get("id");
    if (id_po) {
      // console.log(clientId);
      this.apiService.getPurchaseOrder(+id_po).subscribe((po) => {
        // console.log(po);
        this.po = po.body;
      });
    } else {
      this.po = undefined;
    }
  }
}
