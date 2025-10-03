import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../../services/product.service";

@Component({
  selector: "app-detail-vendor",
  imports: [BaseComponent, CommonModule],
  standalone: true,
  templateUrl: "./detail-vendor.component.html",
  styleUrl: "./detail-vendor.component.css",
})
export class DetailVendorComponent {
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
    private router: Router,
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

  editVendor(vendor: any) {
    this.router.navigate(["/vendors/edit", vendor.id]);
  }

  returnClientList() {
    this.router.navigate(["/vendors/list"]);
  }
}
