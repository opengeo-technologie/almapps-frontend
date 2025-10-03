import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { ProductService } from "../../../services/product.service";
import { FormsModule } from "@angular/forms";
declare var M: any;

@Component({
  selector: "app-input-product",
  imports: [CommonModule, BaseComponent, FormsModule],
  standalone: true,
  templateUrl: "./input-product.component.html",
  styleUrl: "./input-product.component.css",
})
export class InputProductComponent {
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

  sourcing: any = {
    product: null,
    vendor: null,
    price: 0,
    quantity: 0,
    date_input: null,
  };

  products: any[] = [];
  productsInputs: any[] = [];
  vendors: any[] = [];
  instanceModal: any;
  newSourcingModal: any;
  InputToDelete: any;
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
      next: (data) => {
        this.products = data;
      },
      error: (err) => console.error(err),
    });

    this.productService.getProductsInputs().subscribe({
      next: (data) => {
        this.productsInputs = data;
        // console.log(this.productsInputs);
      },
      error: (err) => console.error(err),
    });

    this.productService.getVendors().subscribe({
      next: (data) => (this.vendors = data),
      error: (err) => console.error(err),
    });
  }

  initModals() {
    const elem = document.getElementById("confirmDelete");
    const new_sourcing = document.getElementById("new_sourcing");
    // console.log(elem);
    const options = {
      dismissible: false,
    };
    this.instanceModal = M.Modal.init(elem, options);
    this.newSourcingModal = M.Modal.init(new_sourcing, options);
  }

  ngOnDestroy() {
    this.navSub?.unsubscribe();
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.productsInputs.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.productsInputs.length / this.rowsPerPage);
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

  newSourcing() {
    this.newSourcingModal.open();
  }

  confirmDeleteClient(input: any) {
    this.InputToDelete = input;
    this.instanceModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  onSubmit() {
    // console.log(this.sourcing);
    const product = this.sourcing.product;
    const product_id = this.sourcing.product.id;
    const vendor_id = this.sourcing.vendor.id;
    delete this.sourcing.product;
    delete this.sourcing.vendor;
    this.sourcing.product_id = product_id;
    this.sourcing.vendor_id = vendor_id;
    this.sourcing.user_id = 1;
    product.stock_security_level =
      product.stock_security_level + this.sourcing.quantity;
    this.productService.saveProductInput(this.sourcing).subscribe({
      next: (data) => {
        // console.log(data.status);
        if (data.status == 201) {
          this.productService.updateProduct(product).subscribe({
            next: (data) => {
              // console.log(data);
              if (data.status == 204) {
                // Handle the response from the server
                M.toast({
                  html: "Data updated successfully....",
                  classes: "rounded green accent-4",
                  inDuration: 500,
                  outDuration: 575,
                });
                this.loadData();
                this.newSourcingModal.close();
              }
            },
            error: (err) => console.error(err),
          });
        }
      },
      error: (err) => console.error(err),
    });
  }

  deleteProductInput() {
    // console.log(this.vendorToDelete);
    const product = this.products.find(
      (el: any) => el.id == this.InputToDelete.product_id
    );
    // console.log(product);
    product.stock_security_level =
      product.stock_security_level - this.InputToDelete.quantity;
    this.productService
      .deleteProductInput(this.InputToDelete)
      .subscribe((response) => {
        if (response.status == 202) {
          this.productService.updateProduct(product).subscribe({
            next: (data) => {
              // console.log(data);
              if (data.status == 204) {
                // Handle the response from the server
                M.toast({
                  html: "Data updated successfully....",
                  classes: "rounded green accent-4",
                  inDuration: 500,
                  outDuration: 575,
                });
                this.loadData();
                this.instanceModal.close();
              }
            },
            error: (err) => console.error(err),
          });
        }
      });
  }
}
