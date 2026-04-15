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
import { generateArrayOfYears } from "../../constants/app.functions";
import { CashRegisterService } from "../../services/cash-register.service";
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
  openRegisterModal: any;
  opening_balance: number = 0;
  closing_balance: number = 0;
  productToDelete: any;
  private navSub?: Subscription;

  selected_year: number = 0;
  opening_amount_input: number = 0;
  selected_month: any;
  selected_date: string = "";
  pickerInstance: any = null;

  minDate: string = "";
  maxDate: string = "";

  currentPage = 1;
  rowsPerPage = 10;

  years = generateArrayOfYears();

  months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  disabledDates: string[] = [];

  cashDeskOpen: any = {
    date: null,
    opening_balance: 0,
    status: "open",
    closing_balance: 0,
  };

  constructor(
    private router: Router,
    private cashService: CashRegisterService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    // console.log(this.userLocation)
    this.loadData();
    this.selected_year = new Date().getFullYear();
    this.selected_month = new Date().getMonth() + 1;
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
    this.initDatepicker();
  }

  loadData() {
    this.cashService.getCashRegisters().subscribe({
      next: (data) => {
        // console.log(data);
        this.data = this.sortByDateDesc(data);
        this.first_data = this.data[0];
        this.second_data = this.data[1];
        this.disabledDates = this.data.map((item) => item.date);
      },
      error: (err) => console.error(err),
    });
  }

  sortByDateDesc(data: any[]) {
    return data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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

  isEditRegister(item: any): boolean {
    if (item.status == "closed" && !this.checkIfOpenedRegister()) {
      return true;
    }
    return false;
  }

  disabledLink(item: any) {
    if (this.isEditRegister(item)) {
      return "";
    }
    return "disabled-link";
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
    const elem4 = document.getElementById("openRegister");
    // console.log(elem);
    const options = {
      dismissible: false,
    };
    this.instanceModal = M.Modal.init(elem, options);
    this.closeRegisterModal = M.Modal.init(elem2, options);
    this.reopenRegisterModal = M.Modal.init(elem3, options);
    this.openRegisterModal = M.Modal.init(elem4, options);
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

  calculateClosingBalance(register: any): number {
    const transactions = register.transactions || [];
    const totalTransactions = transactions.reduce((sum: number, tx: any) => {
      if (tx.type === "in") {
        return sum + tx.amount;
      } else if (tx.type === "out") {
        return sum - tx.amount;
      }
      return sum;
    }, 0);
    return register.opening_balance + totalTransactions;
  }

  openNewRegister() {
    this.openRegisterModal.open();
  }

  openCloseRegister(register_id: number) {
    this.cashService.getCashRegister(register_id).subscribe({
      next: (res: any) => {
        console.log(res);
        M.toast({
          html: "Transactions loaded successfully....",
          classes: "rounded green accent-4",
          inDuration: 500,
          outDuration: 575,
        });
        this.closing_balance = this.calculateClosingBalance(res);
        console.log(`Closing Balance set to: ${this.closing_balance}`);
        this.closeRegisterModal.open();
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

  reopenRegisterTransactions(cash_id: number) {
    this.getCashRegister(cash_id);
    this.reopenRegisterModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  openRegister() {
    const data = {
      register_date: this.selected_date,
      opening_balance: this.opening_amount_input,
    };
    // console.log(this.vendorToDelete);
    // this.cashService.openRegister(this.opening_balance).subscribe({
    //   next: (res: any) => {
    //     M.toast({
    //       html: "Cash register opened successfully....",
    //       classes: "rounded green accent-4",
    //       inDuration: 500,
    //       outDuration: 575,
    //     });
    //     this.loadData();
    //     this.closeModal();
    //   },
    //   error: (err: Error) => {
    //     M.toast({
    //       html: err,
    //       classes: "rounded red accent-4",
    //       inDuration: 500,
    //       outDuration: 1000,
    //     });
    //     this.loadData();
    //     this.closeModal();
    //     console.log(err);
    //   },
    // });
  }

  createCashDesk() {
    const data = {
      register_date: this.selected_date,
      opening_balance: this.opening_amount_input,
    };
    this.cashService.saveDailyCashDesk(data).subscribe({
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

  reopenRegister(register_id: number) {
    if (this.checkIfOpenedRegister()) {
      this.cashService.getOpenedCashRegister().subscribe((response) => {
        // console.log(response);
        this.closeRegister();
        this.cashService
          .reopenRegister(register_id)
          .subscribe((response) => {});
      });
    } else {
      this.cashService.reopenRegister(register_id).subscribe((response) => {
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
    this.cashService
      .closeRegister(this.closing_balance)
      .subscribe((response) => {
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

  onYearChange(): void {
    this.selected_date = "";
    this.updateDateRange();
  }

  onMonthChange(): void {
    this.selected_date = "";
    this.updateDateRange();
  }

  updateDateRange(): void {
    if (this.selected_year && this.selected_month) {
      // First day of selected month
      const firstDay = new Date(this.selected_year, this.selected_month - 1, 1);

      // Last day of selected month (day 0 of next month = last day of current)
      const lastDay = new Date(this.selected_year, this.selected_month, 0);

      this.minDate = this.formatDate(firstDay);
      this.maxDate = this.formatDate(lastDay);
    } else {
      this.minDate = "";
      this.maxDate = "";
    }
    // Re-initialize picker with new min/max
    this.initDatepicker();
  }

  initDatepicker(): void {
    const el = document.getElementById("date_op");
    if (!el) return;

    // Destroy previous instance if exists
    if (this.pickerInstance) {
      this.pickerInstance.destroy();
    }

    this.pickerInstance = M.Datepicker.init(el, {
      format: "yyyy-mm-dd",
      minDate: this.minDate ? new Date(this.minDate) : null,
      maxDate: this.maxDate ? new Date(this.maxDate) : null,

      // 🔑 Key: disable specific dates
      onDraw: () => {
        this.disableSpecificDates();
      },

      onSelect: (date: Date) => {
        const formatted = this.formatDate(date);
        if (this.isDateDisabled(formatted)) {
          this.selected_date = "";
          this.pickerInstance.setDate(null);
          M.toast({
            html: "This date is not available. Please select another date.",
            classes: "red",
          });
        } else {
          this.selected_date = formatted;
        }
      },
    });
  }

  // Visually disable dates in the calendar DOM
  disableSpecificDates(): void {
    setTimeout(() => {
      const dayCells = document.querySelectorAll(
        ".datepicker-table td.is-selectable",
      );

      dayCells.forEach((cell: Element) => {
        const el = cell as HTMLElement;
        const dayNum = parseInt(el.innerText.trim(), 10);
        if (!dayNum || !this.selected_year || !this.selected_month) return;

        const dateStr = this.formatDate(
          new Date(this.selected_year, this.selected_month - 1, dayNum),
        );

        if (this.isDateDisabled(dateStr)) {
          // Remove selectable, add disabled styles
          el.classList.remove("is-selectable");
          el.classList.add("is-disabled");
          el.style.pointerEvents = "none";
          el.style.color = "#e0e0e0";
          el.style.textDecoration = "line-through";
          el.style.cursor = "not-allowed";
        }
      });
    }, 0); // setTimeout ensures DOM is rendered
  }

  isDateDisabled(date: string): boolean {
    return this.disabledDates.includes(date);
  }
  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}
