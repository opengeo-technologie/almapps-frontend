import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { ToolsService } from "../../services/tools.service";
import { CashManagementService } from "../../services/cash-management.service";
import { CustomCurrencyPipe } from "../../pipes/currency.pipe";
import { FormsModule } from "@angular/forms";
declare var M: any;

@Component({
  selector: "app-cash-management",
  imports: [CommonModule, BaseComponent, CustomCurrencyPipe, FormsModule],
  standalone: true,
  templateUrl: "./cash-management.component.html",
  styleUrl: "./cash-management.component.css",
})
export class CashManagementComponent {
  submenus: any[] = [
    {
      url: "/cash-management/list",
      name: "Cash register",
      icon: "cashier.svg",
    },
    {
      url: "/transactions/list",
      name: "Transactions",
      icon: "transaction.svg",
    },
  ];

  data: any[] = [];
  first_data: any;
  second_data: any;
  openedRegister: any;
  cashRegister: any;
  instanceModal: any;
  closeRegisterModal: any;
  reopenRegisterModal: any;
  opening_balance: number = 0;
  productToDelete: any;
  private navSub?: Subscription;

  currentPage = 1;
  rowsPerPage = 10;

  constructor(
    private router: Router,
    private cashService: CashManagementService,
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
    this.cashService.getCashRegisters().subscribe({
      next: (data) => {
        this.data = this.sortByDateDesc(data);
        this.first_data = this.data[0];
        this.second_data = this.data[1];
      },
      error: (err) => console.error(err),
    });
  }

  sortByDateDesc(data: any[]) {
    return data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  checkIfOpenedRegister(): boolean {
    let register = this.data.find((item: any) => item.status == "open");
    if (register) {
      this.openedRegister = register;
      return true;
    } else {
      return false;
    }
  }

  validateReopen(item: any): boolean {
    if (
      item.status == "closed" &&
      (item.id == this.first_data.id || item.id == this.second_data.id)
    ) {
      return true;
    }
    return false;
  }

  getCashRegister(cash_id: number) {
    let register = this.data.find((item: any) => item.id == cash_id);
    if (register) {
      this.cashRegister = register;
    }
  }

  initModals() {
    const elem = document.getElementById("confirmOpenRegister");
    const elem2 = document.getElementById("confirmCloseRegister");
    const elem3 = document.getElementById("confirmReopenRegister");
    // console.log(elem);
    const options = {
      dismissible: false,
    };
    this.instanceModal = M.Modal.init(elem, options);
    this.closeRegisterModal = M.Modal.init(elem2, options);
    this.reopenRegisterModal = M.Modal.init(elem3, options);
  }

  ngOnDestroy() {
    this.navSub?.unsubscribe();
  }

  editClient(client: any) {
    this.router.navigate(["/tools/edit", client.id]);
  }

  detailCashRegister(data: any) {
    this.router.navigate(["/cash-management/transactions", data.id]);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.data.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.data.length / this.rowsPerPage);
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

  openNewRegister() {
    this.instanceModal.open();
  }

  openCloseRegister() {
    this.closeRegisterModal.open();
  }

  reopenRegisterTransactions(cash_id: number) {
    this.getCashRegister(cash_id);
    this.reopenRegisterModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  openRegister() {
    // console.log(this.vendorToDelete);
    this.cashService.openRegister(this.opening_balance).subscribe({
      next: (res: any) => {
        M.toast({
          html: "Cash register opened successfully....",
          classes: "rounded green accent-4",
          inDuration: 500,
          outDuration: 575,
        });
        this.loadData();
        this.closeModal();
      },
      error: (err: Error) => {
        M.toast({
          html: err,
          classes: "rounded red accent-4",
          inDuration: 500,
          outDuration: 1000,
        });
        this.loadData();
        this.closeModal();
        console.log(err);
      },
    });
  }

  reopenRegister(cash_id: number) {
    if (this.checkIfOpenedRegister()) {
      this.cashService.getOpenedCashRegister().subscribe((response) => {
        // console.log(response);
        this.closeRegister();
        this.cashService.reopenRegister(cash_id).subscribe((response) => {});
      });
    } else {
      this.cashService.reopenRegister(cash_id).subscribe((response) => {
        M.toast({
          html: "Cash register reopened successfully....",
          classes: "rounded green accent-4",
          inDuration: 500,
          outDuration: 575,
        });
        this.loadData();
        this.closeModal();
      });
    }
  }

  closeRegister() {
    // console.log(this.vendorToDelete);
    this.cashService.closeRegister().subscribe((response) => {
      M.toast({
        html: "Cash register closed successfully....",
        classes: "rounded red accent-4",
        inDuration: 500,
        outDuration: 575,
      });
      this.loadData();
      this.closeModal();
    });
  }
}
