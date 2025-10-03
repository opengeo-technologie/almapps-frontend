import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { BaseComponent } from "../base/base.component";
import { FormsModule } from "@angular/forms";
import { CompanyDetailService } from "../../services/company-detail.service";
import { InvoiceService } from "../../services/invoice.service";
import { CustomCurrencyPipe } from "../../pipes/currency.pipe";
import { PaymentService } from "../../services/payment.service";
declare var M: any;

@Component({
  selector: "app-payment",
  imports: [CommonModule, BaseComponent, FormsModule, CustomCurrencyPipe],
  standalone: true,
  templateUrl: "./payment.component.html",
  styleUrl: "./payment.component.css",
})
export class PaymentComponent {
  submenus: any[] = [
    {
      url: "/payments/list",
      name: "Payments",
      icon: "013-payment-method.svg",
    },
  ];
  payments: any[] = [];
  instanceModal: any;
  techToDelete: any;
  newTechModal: any;
  private navSub?: Subscription;
  isAddForm: boolean = true;

  currentPage = 1;
  rowsPerPage = 10;

  constructor(
    private router: Router,
    private apiService: PaymentService,
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
    this.apiService.getPayments().subscribe({
      next: (data) => {
        // console.log(data);
        this.payments = data;
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
    return this.payments.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.payments.length / this.rowsPerPage);
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
    this.router.navigate(["/payments/edit", item.id]);
  }

  print(item: any) {
    this.router.navigate(["/payments/print", item.id]);
  }

  confirmDelete(tech: any) {
    this.techToDelete = tech;
    this.instanceModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }
}
