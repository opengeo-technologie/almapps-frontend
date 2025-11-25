import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ToolsService } from "../../../services/tools.service";
import { CashManagementService } from "../../../services/cash-management.service";
import { CustomCurrencyPipe } from "../../../pipes/currency.pipe";
declare var M: any;

@Component({
  selector: "app-transactions",
  imports: [CommonModule, BaseComponent, CustomCurrencyPipe],
  standalone: true,
  templateUrl: "./transactions.component.html",
  styleUrl: "./transactions.component.css",
})
export class TransactionsComponent {
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
  instanceModal: any;
  dataToDelete: any;
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
    this.cashService.getTransactions().subscribe({
      next: (data) => {
        this.data = this.sortByDateDesc(data);
      },
      error: (err) => console.error(err),
    });
  }

  sortByDateDesc(data: any[]) {
    return data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
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

  editTransaction(item: any) {
    this.router.navigate(["/transactions/edit", item.id]);
  }

  detailClient(client: any) {
    this.router.navigate(["/tools/detail", client.id]);
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

  confirmDeleteClient(item: any) {
    this.dataToDelete = item;
    this.instanceModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  deleteTransaction() {
    this.cashService.deleteTransaction(this.dataToDelete).subscribe({
      next: (data) => {
        // console.log(data);
        if (data.status == 204) {
          // Handle the response from the server
          M.toast({
            html: "Data deleted successfully....",
            classes: "rounded red accent-4",
            inDuration: 500,
            outDuration: 575,
          });
          this.loadData();
          this.router.navigate(["/transactions/list"]);
        }
      },
      error: (err) => console.error(err),
    });
  }
}
