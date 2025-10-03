import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ProductService } from "../../services/product.service";
import { BaseComponent } from "../base/base.component";
declare var M: any;

@Component({
  selector: "app-vendors",
  imports: [CommonModule, BaseComponent],
  standalone: true,
  templateUrl: "./vendors.component.html",
  styleUrl: "./vendors.component.css",
})
export class VendorsComponent {
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

  vendors: any[] = [];
  instanceModal: any;
  vendorToDelete: any;
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
    this.productService.getVendors().subscribe({
      next: (data) => (this.vendors = data),
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

  editVendor(vendor: any) {
    this.router.navigate(["/vendors/edit", vendor.id]);
  }

  detailVendor(vendor: any) {
    this.router.navigate(["/vendors/detail", vendor.id]);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.vendors.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.vendors.length / this.rowsPerPage);
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
    this.vendorToDelete = client;
    this.instanceModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  deleteVendor() {
    // console.log(this.vendorToDelete);
    this.productService
      .deleteVendor(this.vendorToDelete)
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
