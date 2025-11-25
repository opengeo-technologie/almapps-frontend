import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { QRCodeComponent } from "angularx-qrcode";
import type * as pdfMakeType from "pdfmake/build/pdfmake";
import * as html2canvas from "html2canvas";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { CustomCurrencyPipe } from "../../../pipes/currency.pipe";
import { CurrencyToWOrdPipe } from "../../../pipes/currency_to_word.pipe";
import { InvoiceService } from "../../../services/invoice.service";
import { BaseComponent } from "../../base/base.component";
import { CashManagementService } from "../../../services/cash-management.service";

@Component({
  selector: "app-reports-transactions",
  imports: [
    BaseComponent,
    FormsModule,
    CommonModule,
    CustomCurrencyPipe,
    CurrencyToWOrdPipe,
  ],
  standalone: true,
  templateUrl: "./reports-transactions.component.html",
  styleUrl: "./reports-transactions.component.css",
})
export class ReportsTransactionsComponent {
  transactions: any | undefined;
  register: any | undefined;
  user: any | undefined;
  private pdfMake: typeof pdfMakeType | null = null;
  showQr = false;
  @ViewChild("poDiv") poDiv!: ElementRef;

  totalDebit: number = 0;
  totalCredit: number = 0;

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: CashManagementService
  ) {
    this.loadPdfMake();
    this.user = JSON.parse(localStorage.getItem("user") || "{}");
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    const cash_id: string | null = this.route.snapshot.paramMap.get("id");
    if (cash_id) {
      // console.log(clientId);
      this.apiService
        .getCashRegisterTransactions(+cash_id)
        .subscribe((transactions) => {
          // console.log(transactions);
          this.transactions = transactions;
          this.calculateTotal();
        });
      this.apiService.getCashRegister(+cash_id).subscribe((register) => {
        this.register = register;
      });
    } else {
      this.transactions = undefined;
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
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      },
    };

    this.pdfMake.createPdf(docDefinition).open();
  }

  calculateTotal() {
    for (let item of this.transactions) {
      if (item.type == "in") {
        this.totalCredit += item.amount;
      } else {
        this.totalDebit += item.amount;
      }
    }
  }

  calculateClosingBalance(): number {
    return this.register.opening_balance + this.totalCredit - this.totalDebit;
  }
}
