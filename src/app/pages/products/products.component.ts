import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { ClientService } from "../../services/client.service";
import { ProductService } from "../../services/product.service";
declare var M: any;

@Component({
  selector: "app-products",
  imports: [CommonModule, BaseComponent],
  standalone: true,
  templateUrl: "./products.component.html",
  styleUrl: "./products.component.css",
})
export class ProductsComponent {
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

  products: any[] = [];
  instanceModal: any;
  productToDelete: any;
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
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    if (isPlatformBrowser(this.platformId)) {
      this.initModals();

      // Re-init modals on every navigation (important for SSR refresh)
      this.navSub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.initModals();
        }
      });
    }
  }

  loadData() {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error(err),
    });
  }

  initModals() {
    const elem = document.getElementById("confirmDelete");
    // console.log(elem);
    const options = {
      dismissible: false,
    };
    this.instanceModal = M.Modal.init(elem, options);
  }

  ngOnDestroy() {
    this.navSub?.unsubscribe();
  }

  editClient(client: any) {
    this.router.navigate(["/products/edit", client.id]);
  }

  detailClient(client: any) {
    this.router.navigate(["/products/detail", client.id]);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.products.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.products.length / this.rowsPerPage);
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

  confirmDeleteClient(client: any) {
    this.productToDelete = client;
    this.instanceModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  deleteProduct() {
    // console.log(this.vendorToDelete);
    this.productService
      .deleteProduct(this.productToDelete)
      .subscribe((response) => {
        if (response.status == 202) {
          // Handle the response from the server
          M.toast({
            html: "Data deleted successfully....",
            classes: "rounded red accent-4",
            inDuration: 500,
            outDuration: 575,
          });
          this.loadData();
          this.closeModal();
        }
      });
  }
}
