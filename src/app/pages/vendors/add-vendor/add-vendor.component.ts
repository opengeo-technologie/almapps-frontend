import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormVendorComponent } from "../form-vendor/form-vendor.component";

@Component({
  selector: "app-add-vendor",
  imports: [BaseComponent, FormVendorComponent],
  standalone: true,
  templateUrl: "./add-vendor.component.html",
  styleUrl: "./add-vendor.component.css",
})
export class AddVendorComponent {
  vendor: any = {
    name: "",
    address: "",
    email: "",
    phone: "",
  };
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

  ngOnInit(): void {}
}
