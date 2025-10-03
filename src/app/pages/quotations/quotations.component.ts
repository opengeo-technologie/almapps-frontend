import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { BaseComponent } from "../base/base.component";
import { FormsModule } from "@angular/forms";
import { PurchaseOrderService } from "../../services/purchase-order.service";
import { CustomCurrencyPipe } from "../../pipes/currency.pipe";
import { QuotationService } from "../../services/quotation.service";
declare var M: any;

@Component({
  selector: "app-quotations",
  imports: [CommonModule, BaseComponent, FormsModule, CustomCurrencyPipe],
  standalone: true,
  templateUrl: "./quotations.component.html",
  styleUrl: "./quotations.component.css",
})
export class QuotationsComponent {
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

  technician: any = {
    name: "",
    email: "",
    phone: "",
    role: null,
  };

  types: any[] = [];
  quotations: any[] = [];
  instanceModal: any;
  techToDelete: any;
  newTechModal: any;
  private navSub?: Subscription;
  isAddForm: boolean = true;

  currentPage = 1;
  rowsPerPage = 10;

  constructor(
    private router: Router,
    private apiService: QuotationService,
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
    this.apiService.getQuotations().subscribe({
      next: (data) => {
        // console.log(data);
        this.quotations = data;
      },
      error: (err) => console.error(err),
    });
  }

  calculateTotalCharges(item: any): number {
    let vat_amount = 0;
    let discount_amount = 0;
    let totalAmount = item.amount;
    if (item.discount_status && item.tva_status) {
      discount_amount = (item.amount * item.discount_percent) / 100;
      totalAmount -= discount_amount;
      vat_amount =
        (totalAmount + item.shipping_amount - discount_amount) * 0.1925;
      totalAmount += vat_amount;
    } else if (item.discount_status && !item.tva_status) {
      discount_amount = (item.amount * item.discount_percent) / 100;
      totalAmount -= discount_amount;
    } else if (!item.discount_status && item.tva_status) {
      vat_amount =
        (totalAmount + item.shipping_amount - discount_amount) * 0.1925;
      totalAmount += vat_amount;
    } else {
    }

    return totalAmount;
  }

  initModals() {
    const elem = document.getElementById("confirmDelete");
    const new_tech = document.getElementById("new_tech");
    // console.log(elem);
    const options = {
      dismissible: false,
    };
    this.instanceModal = M.Modal.init(elem, options);
    this.newTechModal = M.Modal.init(new_tech, options);
  }

  ngOnDestroy() {
    this.navSub?.unsubscribe();
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.quotations.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.quotations.length / this.rowsPerPage);
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

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id && c1.role === c2.role : c1 === c2;
  }

  edit(po: any) {
    this.router.navigate(["/quotations/edit", po.id]);
  }

  print(po: any) {
    this.router.navigate(["/quotations/print", po.id]);
  }

  confirmDelete(tech: any) {
    this.techToDelete = tech;
    this.instanceModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  // deleteTechnician() {
  //   // console.log(this.vendorToDelete);
  //   this.techService
  //     .deleteTechnician(this.techToDelete)
  //     .subscribe((response) => {
  //       if (response.status == 202) {
  //         // Handle the response from the server
  //         M.toast({
  //           html: "Data deleted successfully....",
  //           classes: "rounded red accent-4",
  //           inDuration: 500,
  //           outDuration: 575,
  //         });
  //         this.loadData();
  //         this.closeModal();
  //       }
  //     });
  // }

  // onSubmit() {
  //   // console.log(this.technician);
  //   const role_id = this.technician.role.id;

  //   const tech = { ...this.technician };

  //   // console.log(tech);
  //   delete tech.role;
  //   tech.role_id = role_id;
  //   if (this.isAddForm) {
  //     this.techService.saveTechnician(tech).subscribe({
  //       next: (data) => {
  //         // console.log(data);
  //         if (data.status == 201) {
  //           // Handle the response from the server
  //           M.toast({
  //             html: "Data created successfully....",
  //             classes: "rounded green accent-4",
  //             inDuration: 500,
  //             outDuration: 575,
  //           });
  //           this.loadData();
  //           this.newTechModal.close();
  //         }
  //       },
  //       error: (err) => console.error(err),
  //     });
  //   } else {
  //     this.techService.updateTechnician(tech).subscribe({
  //       next: (data) => {
  //         // console.log(data);
  //         if (data.status == 204) {
  //           // Handle the response from the server
  //           M.toast({
  //             html: "Data updated successfully....",
  //             classes: "rounded green accent-4",
  //             inDuration: 500,
  //             outDuration: 575,
  //           });
  //           this.loadData();
  //           this.newTechModal.close();
  //         }
  //       },
  //       error: (err) => console.error(err),
  //     });
  //   }
  // }
}
