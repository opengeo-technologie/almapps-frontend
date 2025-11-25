import { Component, ElementRef, ViewChild } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { QRCodeComponent } from "angularx-qrcode";
import { CustomCurrencyPipe } from "../../../pipes/currency.pipe";
import { CurrencyToWOrdPipe } from "../../../pipes/currency_to_word.pipe";

import type * as pdfMakeType from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import * as html2canvas from "html2canvas";
declare var M: any;

import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isSameMonth,
  getISOWeek,
  startOfISOWeek,
  isSameYear,
  endOfISOWeek,
  startOfYear,
  endOfYear,
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { Router } from "@angular/router";
import { ExpenseService } from "../../../services/expense.service";

interface WeekRange {
  label: string;
  start: Date;
  end: Date;
  weekNumber: number;
}

@Component({
  selector: "app-report-expense",
  standalone: true,
  imports: [
    BaseComponent,
    FormsModule,
    CommonModule,
    CustomCurrencyPipe,
    CurrencyToWOrdPipe,
  ],
  templateUrl: "./report-expense.component.html",
  styleUrl: "./report-expense.component.css",
})
export class ReportExpenseComponent {
  @ViewChild("selectYear") selectYear!: ElementRef;
  @ViewChild("selectMonth") selectMonth!: ElementRef;
  @ViewChild("selectWeek") selectWeek!: ElementRef;
  @ViewChild("poDiv") poDiv!: ElementRef;

  private pdfMake: typeof pdfMakeType | null = null;

  expense: any | undefined;
  user: any | undefined;
  expenses: any[] = [];

  years: number[] = [];
  months: { value: number; name: string }[] = [];
  groupedWeeks: { month: string; weeks: WeekRange[] }[] = [];

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;
  selectedWeek: any = null;

  isYearActive: boolean = false;
  isMonthActive: boolean = true;
  isWeekActive: boolean = false;

  submenus: any[] = [
    {
      url: "/expenses/list",
      name: "Expenses",
      icon: "money.svg",
    },
    {
      url: "/expenses/report",
      name: "Expenses reports",
      icon: "write.svg",
    },
  ];

  constructor(private router: Router, private expenseService: ExpenseService) {
    this.user = JSON.parse(localStorage.getItem("user") || "{}");
    this.loadPdfMake();
  }

  ngOnInit(): void {
    this.years = this.getYearRange(2023, this.selectedYear);
    this.months = this.getMonthList();
    this.generateWeeks(this.selectedYear, this.selectedMonth);
    // const weeks = this.getWeeksOfMonth(2025, 11);
    // console.log(weeks);
    // console.log(this.groupedWeeks);

    setTimeout(() => {
      M.FormSelect.init(this.selectYear.nativeElement);
      M.FormSelect.init(this.selectMonth.nativeElement);
    }, 300);
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
      setTimeout(() => {
        M.FormSelect.init(this.selectWeek.nativeElement);
      }, 300);
    }
  }

  formatDateToYYYYMMDD(dateStr: Date): string {
    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  getWeeksOfMonth(year: number, month: number) {
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));

    const weekStarts = eachWeekOfInterval(
      { start, end },
      { weekStartsOn: 1 } // Monday
    );

    const label = `${format(start, "MMM dd")} – ${format(end, "MMM dd")}`;

    return weekStarts.map((weekStart) => ({
      weekNumber: getISOWeek(weekStart),
      startDate: startOfWeek(weekStart, { weekStartsOn: 1 }),
      endDate: endOfWeek(weekStart, { weekStartsOn: 1 }),
    }));
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
        weekNumber: getISOWeek(current),
      };

      if (existingGroup) {
        existingGroup.weeks.push(week);
      } else {
        this.groupedWeeks.push({ month, weeks: [week] });
      }

      current = addWeeks(current, 1);
    }

    // console.log(this.groupedWeeks);
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
      setTimeout(() => {
        M.FormSelect.init(this.selectYear.nativeElement);
      }, 300);
    } else if (inputElement.value == "month") {
      this.isYearActive = false;
      this.isMonthActive = true;
      this.isWeekActive = false;
      setTimeout(() => {
        M.FormSelect.init(this.selectMonth.nativeElement);
      }, 300);
    } else {
      this.isYearActive = false;
      this.isMonthActive = false;
      this.isWeekActive = true;
      setTimeout(() => {
        M.FormSelect.init(this.selectMonth.nativeElement);
        M.FormSelect.init(this.selectWeek.nativeElement);
      }, 300);
    }
  }

  getMonthName(month: number, locale = "en-US"): string {
    const date = new Date();
    date.setMonth(month - 1); // car janvier = 0
    return date.toLocaleString(locale, { month: "long" });
  }

  calculateTotalAmountJobs(item: any): number {
    return item.job.duration * item.job.price;
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
      for (let item of this.expense.products) {
        result += this.calculateTotalAmountJobs(item);
      }
    } else if (invoice.jobs.length != 0) {
      for (let item of invoice.jobs) {
        result += this.calculateTotalAmountJobs(item);
      }
    } else {
      for (let item of invoice.technicians) {
        result += this.calculateTotalTechnicianAmountHours(item);
      }
    }

    return result;
  }

  calculateVATAmount(): number {
    if (this.expense.tva_status) {
      return this.calculateTotalWithouxVAT(this.expense.invoice) * 0.1925;
    } else {
      return 0;
    }
  }

  calculateTotalInvoice(): number {
    return Math.round(
      this.calculateTotalWithouxVAT(this.expense.invoice) +
        this.calculateVATAmount()
    );
  }
  calculateTotalExpense(): number {
    let result = 0;
    for (let item of this.expenses) {
      result += item.amount;
    }
    return Math.round(result);
  }

  reportTitle() {
    if (this.isYearActive) {
      return "Expense report of the year " + this.selectedYear;
    } else if (this.isMonthActive) {
      return "Monthly report of " + this.getMonthName(this.selectedMonth);
    } else {
      const week = JSON.parse(this.selectedWeek);
      return (
        "Weekly report from " +
        format(week.start, "dd-MM-yyyy") +
        " to " +
        format(week.end, "dd-MM-yyyy")
      );
    }
  }

  private async loadPdfMake() {
    if (this.pdfMake) return;

    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfFontsModule = await import("pdfmake/build/vfs_fonts");

    const pdfMake = pdfMakeModule.default;
    pdfMake.vfs = pdfFontsModule.default.vfs;

    this.pdfMake = pdfMake;
  }

  async generatePdf() {
    await this.loadPdfMake(); // Assure que pdfMake est chargé

    const element = this.poDiv.nativeElement as HTMLElement;

    // 1️⃣ Convertir div en canvas
    const canvas = await html2canvas.default(element, { scale: 2 });

    // 2️⃣ Convertir canvas en image base64
    const imgData = canvas.toDataURL("image/png", 0.3);

    // 3️⃣ Créer le PDF
    const docDefinition: TDocumentDefinitions = {
      content: [
        { image: imgData, width: 500 }, // Ajuste la largeur
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      },
    };

    this.pdfMake.createPdf(docDefinition).open();
  }

  onSubmit() {
    if (this.isYearActive) {
      this.expenseService
        .getExpenseReportByYear(this.selectedYear)
        .subscribe((expenses: any[]) => {
          // console.log(expenses);
          this.expenses = expenses;
        });
    } else if (this.isMonthActive) {
      this.expenseService
        .getExpenseReportByMonth(this.selectedMonth)
        .subscribe((expenses: any[]) => {
          // console.log(expenses);
          this.expenses = expenses;
        });
    } else {
      // console.log(JSON.parse(this.selectedWeek));
      const week = JSON.parse(this.selectedWeek).weekNumber;
      this.expenseService
        .getExpenseReportByWeek(week)
        .subscribe((expenses: any[]) => {
          // console.log(expenses);
          this.expenses = expenses;
        });
    }
  }
}
