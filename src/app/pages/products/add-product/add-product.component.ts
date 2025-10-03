import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormProductComponent } from "../form-product/form-product.component";

@Component({
  selector: "app-add-product",
  imports: [BaseComponent, FormProductComponent],
  standalone: true,
  templateUrl: "./add-product.component.html",
  styleUrl: "./add-product.component.css",
})
export class AddProductComponent {
  product: any = {
    name: "",
    description: "",
    unit: "",
    stock_security_level: 0.0,
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
