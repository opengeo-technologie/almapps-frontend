import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { ProductService } from "../../../services/product.service";
import { FormsModule } from "@angular/forms";
declare var M: any;

@Component({
  selector: "app-output-product",
  imports: [CommonModule, BaseComponent, FormsModule],
  standalone: true,
  templateUrl: "./output-product.component.html",
  styleUrl: "./output-product.component.css",
})
export class OutputProductComponent {
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

  productsOutputs: any[] = [];
  private navSub?: Subscription;

  currentPage = 1;
  rowsPerPage = 5;

  constructor(
    private router: Router,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    // console.log(this.userLocation)
    this.loadData();
    // this.getProductById(1);
  }

  loadData() {
    this.productService.getProductsOutputs().subscribe({
      next: (data) => {
        this.productsOutputs = data;
        // console.log(this.productsInputs);
      },
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy() {
    this.navSub?.unsubscribe();
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.productsOutputs.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.productsOutputs.length / this.rowsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
