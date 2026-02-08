import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { BaseComponent } from "../base/base.component";
import { FormsModule } from "@angular/forms";
import { CompanyDetailService } from "../../services/company-detail.service";
import { InvoiceService } from "../../services/invoice.service";
import { CustomCurrencyPipe } from "../../pipes/currency.pipe";
declare var M: any;

@Component({
  selector: "app-invoices",
  imports: [CommonModule, BaseComponent, FormsModule, CustomCurrencyPipe],
  standalone: true,
  templateUrl: "./invoices.component.html",
  styleUrl: "./invoices.component.css",
})
export class InvoicesComponent {
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
  invoices: any[] = [];
  instanceModal: any;
  techToDelete: any;
  newTechModal: any;
  private navSub?: Subscription;
  isAddForm: boolean = true;

  currentPage = 1;
  rowsPerPage = 10;

  constructor(
    private router: Router,
    private apiService: InvoiceService,
    private companyService: CompanyDetailService,
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
    this.apiService.getInvoices().subscribe({
      next: (data) => {
        console.log(data);
        this.invoices = data;
      },
      error: (err) => console.error(err),
    });
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
    return this.invoices.slice(start, start + this.rowsPerPage);
  }

  totalPayment(payments: any[]) {
    let result = 0;
    for (let item of payments) {
      result += item.amount;
    }
    return result;
  }

  totalPages() {
    return Math.ceil(this.invoices.length / this.rowsPerPage);
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

  edit(item: any) {
    this.router.navigate(["/invoices/edit", item.id]);
  }

  print(item: any) {
    this.router.navigate(["/invoices/print", item.id]);
  }

  confirmDelete(tech: any) {
    this.techToDelete = tech;
    this.instanceModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  calculateTotalAmountJobs(invoice: any, item: any): number {
    if (invoice.products.length != 0) {
      return item.quantity * item.unit_price;
    } else {
      return item.job.duration * item.job.price;
    }
  }

  calculateTotalTechnicianAmountHours(item: any) {
    let normal_hours_amount =
      (item.normal_hour1 + item.normal_hour2) * item.normal_unit_price;
    let overtime_hours_amount =
      (item.overtime_hour1 + item.overtime_hour2) * item.overtime_unit_price;
    let allowance_hours_amount =
      (item.allowance_hour1 + item.allowance_hour2) * item.allowance_unit_price;

    return normal_hours_amount + overtime_hours_amount + allowance_hours_amount;
  }

  calculateTotalWithouxVAT(invoice: any): number {
    let result = 0;
    if (invoice.products.length != 0) {
      for (let item of invoice.products) {
        result += this.calculateTotalAmountJobs(invoice, item);
      }
    } else if (invoice.jobs.length != 0) {
      for (let item of invoice.jobs) {
        result += this.calculateTotalAmountJobs(invoice, item);
      }
    } else {
      for (let item of invoice.technicians) {
        result += this.calculateTotalTechnicianAmountHours(item);
      }
    }

    return result;
  }

  calculateVATAmount(invoice: any): number {
    if (invoice.tva_status) {
      return this.calculateTotalWithouxVAT(invoice) * 0.1925;
    } else {
      return 0;
    }
  }

  calculateTotal(invoice: any): number {
    return Math.round(
      this.calculateTotalWithouxVAT(invoice) + this.calculateVATAmount(invoice)
    );
  }
}
