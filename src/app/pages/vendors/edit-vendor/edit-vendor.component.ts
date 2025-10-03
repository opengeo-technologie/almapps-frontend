import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormVendorComponent } from "../form-vendor/form-vendor.component";
import { ProductService } from "../../../services/product.service";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-edit-vendor",
  imports: [BaseComponent, FormVendorComponent, CommonModule],
  standalone: true,
  templateUrl: "./edit-vendor.component.html",
  styleUrl: "./edit-vendor.component.css",
})
export class EditVendorComponent {
  vendor: any | undefined;
  submenus: any[] = [
    {
      url: "/vendors/list",
      name: "Vendors",
      icon: "vendor.svg",
    },
    {
      url: "/products/list",
      name: "Products",
      icon: "maintenance.svg",
    },
    {
      url: "/products/input",
      name: "Product input list",
      icon: "add-product.svg",
    },
    {
      url: "/products/output",
      name: "Product output list",
      icon: "delete.svg",
    },
    {
      url: "/products/inventory",
      name: "Inventory report",
      icon: "inventory.svg",
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const vendorId: string | null = this.route.snapshot.paramMap.get("id");
    if (vendorId) {
      // console.log(clientId);
      this.productService.getVendor(+vendorId).subscribe((vendor) => {
        // console.log(client);
        this.vendor = vendor;
      });
    } else {
      this.vendor = undefined;
    }
  }
}
