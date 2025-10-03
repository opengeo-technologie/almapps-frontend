import { Component } from "@angular/core";
import { FormProductComponent } from "../form-product/form-product.component";
import { BaseComponent } from "../../base/base.component";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../services/product.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-edit-product",
  imports: [BaseComponent, FormProductComponent, CommonModule],
  standalone: true,
  templateUrl: "./edit-product.component.html",
  styleUrl: "./edit-product.component.css",
})
export class EditProductComponent {
  product: any | undefined;
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
    const productId: string | null = this.route.snapshot.paramMap.get("id");
    if (productId) {
      // console.log(clientId);
      this.productService.getProduct(+productId).subscribe((product) => {
        // console.log(product);
        this.product = product;
      });
    } else {
      this.product = undefined;
    }
  }
}
