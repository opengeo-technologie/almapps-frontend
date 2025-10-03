import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { ProductService } from "../../../services/product.service";
import { FormsModule } from "@angular/forms";
declare var M: any;
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isSameMonth,
} from "date-fns";

interface WeekRange {
  label: string;
  start: Date;
  end: Date;
}

@Component({
  selector: "app-inventory",
  imports: [CommonModule, BaseComponent, FormsModule],
  standalone: true,
  templateUrl: "./inventory.component.html",
  styleUrl: "./inventory.component.css",
})
export class InventoryComponent {
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

  years: number[] = [];
  months: { value: number; name: string }[] = [];
  groupedWeeks: { month: string; weeks: WeekRange[] }[] = [];

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;
  selectedWeek: any = null;
  selectedProducts: any = "all";

  isYearActive: boolean = false;
  isMonthActive: boolean = true;
  isWeekActive: boolean = false;

  expenses: any[] | undefined;
  period: any | undefined;
  products: any[] = [];

  private navSub?: Subscription;

  constructor(
    private router: Router,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    this.years = this.getYearRange(2023, this.selectedYear);
    this.months = this.getMonthList();
    this.generateWeeks(this.selectedYear, this.selectedMonth);
    this.loadData();
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    if (isPlatformBrowser(this.platformId)) {
      this.initSelects();

      // Re-init modals on every navigation (important for SSR refresh)
      this.navSub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.initSelects();
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

  initSelects() {
    const elem = document.getElementById("select-products");
    // console.log(elem);
    const options = {};
    M.FormSelect.init(elem, options);
  }

  getYearRange(start: number, end: number): number[] {
    const range = [];
    for (let y = start; y <= end; y++) range.push(y);
    return range;
  }

  getMonthList() {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      name: new Date(0, i).toLocaleString("en-EN", { month: "long" }),
    }));
  }

  onYearOrMonthChange(): void {
    if (this.isWeekActive) {
      this.generateWeeks(this.selectedYear, this.selectedMonth);
    }
  }

  formatDateToYYYYMMDD(dateStr: Date): string {
    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  generateWeeks(year: number, month: number): void {
    this.groupedWeeks = [];
    const startDate = new Date(year, month - 1, 1); // June is month 5 (0-indexed)
    const endDate = new Date(year, month, 0); // July 31

    let current = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday as start of week

    while (current <= endDate) {
      const weekStart = current;
      const weekEnd = endOfWeek(current, { weekStartsOn: 1 });

      const month = format(weekStart, "MMMM yyyy");

      const label = `${format(weekStart, "MMM dd")} – ${format(
        weekEnd,
        "MMM dd"
      )}`;

      const existingGroup = this.groupedWeeks.find((g) => g.month === month);
      const week: WeekRange = {
        label,
        start: weekStart,
        end: weekEnd,
      };

      if (existingGroup) {
        existingGroup.weeks.push(week);
      } else {
        this.groupedWeeks.push({ month, weeks: [week] });
      }

      current = addWeeks(current, 1);
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  onSelectionChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    // console.log("Selected value:", inputElement.value);
    if (inputElement.value == "year") {
      this.isYearActive = true;
      this.isMonthActive = false;
      this.isWeekActive = false;
    } else if (inputElement.value == "month") {
      this.isYearActive = false;
      this.isMonthActive = true;
      this.isWeekActive = false;
    } else {
      this.isYearActive = false;
      this.isMonthActive = false;
      this.isWeekActive = true;
    }
  }

  getMonthName(month: number, locale = "en-US"): string {
    const date = new Date();
    date.setMonth(month - 1); // car janvier = 0
    return date.toLocaleString(locale, { month: "long" });
  }

  generateInventory() {}
}
