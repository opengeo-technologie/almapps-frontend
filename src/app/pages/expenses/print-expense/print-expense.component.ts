import { Component, ElementRef, ViewChild } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomCurrencyPipe } from "../../../pipes/currency.pipe";
import { CurrencyToWOrdPipe } from "../../../pipes/currency_to_word.pipe";
import { QRCodeComponent } from "angularx-qrcode";
// Types
import type * as pdfMakeType from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import * as html2canvas from "html2canvas";
import { QuotationService } from "../../../services/quotation.service";
import { InvoiceService } from "../../../services/invoice.service";
import { ExpenseService } from "../../../services/expense.service";

@Component({
  selector: "app-print-expense",
  standalone: true,
  imports: [
    BaseComponent,
    FormsModule,
    CommonModule,
    CustomCurrencyPipe,
    CurrencyToWOrdPipe,
    QRCodeComponent,
  ],
  templateUrl: "./print-expense.component.html",
  styleUrl: "./print-expense.component.css",
})
export class PrintExpenseComponent {
  expense: any | undefined;
  private pdfMake: typeof pdfMakeType | null = null;
  showQr = false;
  @ViewChild("poDiv") poDiv!: ElementRef;
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ExpenseService
  ) {
    this.loadPdfMake();
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    const expense_id: string | null = this.route.snapshot.paramMap.get("id");
    if (expense_id) {
      // console.log(clientId);
      this.apiService.getExpense(+expense_id).subscribe((expense) => {
        console.log(expense);
        this.expense = expense;
      });
    } else {
      this.expense = undefined;
    }
  }

  ngAfterViewInit() {
    // s’assure que c’est côté client
    this.showQr = true;
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
        header: { fontSize: 15, bold: true, margin: [0, 0, 0, 10] },
      },
    };

    this.pdfMake.createPdf(docDefinition).open();
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
    for (let item of this.expense.tasks) {
      result += item.amount;
    }
    return Math.round(result);
  }
}
