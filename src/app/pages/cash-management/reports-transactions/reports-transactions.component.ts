import { CommonModule, DatePipe } from "@angular/common";
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
import { ImageHelperService } from "../../../services/image-helper.service";
import { color } from "html2canvas/dist/types/css/types/color";
import { textDecorationLine } from "html2canvas/dist/types/css/property-descriptors/text-decoration-line";
import { AuthService } from "../../../services/auth.service";
import { CompanyDetailService } from "../../../services/company-detail.service";

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
  providers: [DatePipe, CustomCurrencyPipe, CurrencyToWOrdPipe],
})
export class ReportsTransactionsComponent {
  transactions: any | undefined;
  register: any | undefined;
  user: any | undefined;
  company: any | undefined;
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
    private apiService: CashManagementService,
    private companyService: CompanyDetailService,
    private imageHelper: ImageHelperService,
    private datePipe: DatePipe,
    private currencyPipe: CustomCurrencyPipe,
    private currencyWordPipe: CurrencyToWOrdPipe,
    private authService: AuthService,
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
    const userData = this.authService.getUser();
    if (userData) {
      // console.log(JSON.parse(userData));
      this.user = JSON.parse(userData);
    }

    this.companyService.getActiveCompanyDetail().subscribe((company) => {
      // console.log(transactions);
      this.company = company;
    });
  }

  rotateBase64Image(base64: string, angle: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        if (angle === 90 || angle === -90) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        resolve(canvas.toDataURL());
      };
    });
  }

  private async loadPdfMake() {
    if (this.pdfMake) return;

    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfFontsModule = await import("pdfmake/build/vfs_fonts");

    const pdfMake = pdfMakeModule.default;
    pdfMake.vfs = pdfFontsModule.default.vfs;

    this.pdfMake = pdfMake;
  }

  private buildItemsTable(currency: string = "FCFA") {
    let body: any[] = [];
    let widths: any[] = [];
    let grandTotal = 0;
    const formattedDate = this.datePipe.transform(
      this.register.date,
      "dd/MM/yyyy",
    );
    widths = ["auto", "*", "auto", "auto", "auto"];
    body = [
      [
        { text: "#", bold: true, fontSize: 11 },
        { text: "Transaction", bold: true, fontSize: 11 },
        { text: "Date", bold: true, fontSize: 11 },
        { text: "Credit", bold: true, fontSize: 11 },
        { text: "Debit", bold: true, fontSize: 11 },
      ],
    ];

    this.transactions.forEach((item: any, index: any) => {
      let debit_amount = 0;
      let credit_amount = 0;
      if (item.type == "in") {
        credit_amount = item.amount;
      } else {
        debit_amount = item.amount;
      }

      body.push([
        { text: `${index + 1}`, fontSize: 10 },
        { text: `${item.description}`, fontSize: 10 },
        { text: `${formattedDate}`, alignment: "right", fontSize: 10 },
        {
          text: `${this.currencyPipe.transform(credit_amount)}`,
          alignment: "right",
          color: "#66bb6a",
          fontSize: 10,
        },
        {
          text: `${this.currencyPipe.transform(debit_amount)}`,
          alignment: "right",
          color: "red",
          fontSize: 10,
        },
      ]);
    });
    body.push([
      {
        text: "Total",
        colSpan: 3,
        alignment: "right",
        bold: true,
        fontSize: 10,
      },
      {},
      {},
      {
        text: this.currencyPipe.transform(this.totalCredit),
        alignment: "right",
        bold: true,
        fillColor: "#66bb6a",
        color: "#ffffff",
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(this.totalDebit),
        alignment: "right",
        bold: true,
        fillColor: "red",
        color: "#ffffff",
        fontSize: 10,
      },
    ]);

    return {
      table: {
        widths: widths,
        body,
      },
      layout: {
        hLineWidth: (i: number) => (i === 0 || i === body.length ? 1 : 0.5),
        vLineWidth: () => 0.5,
        hLineColor: () => "#CCCCCC",
        vLineColor: () => "#CCCCCC",
        paddingLeft: () => 8,
        paddingRight: () => 8,
        paddingTop: () => 6,
        paddingBottom: () => 6,
      },
    };
  }

  private buildClosingStatsTable() {
    let body: any[] = [];
    let widths: any[] = [];
    let grandTotal = 0;
    const formattedDate = this.datePipe.transform(
      this.register.date,
      "dd/MM/yyyy",
    );
    widths = ["*", "*", "*", "*"];
    body = [
      [
        {
          text: "Opening balance",
          bold: true,
          fontSize: 11,
          fillColor: "grey",
          color: "#ffffff",
        },
        {
          text: "Total credit",
          bold: true,
          fontSize: 11,
          fillColor: "grey",
          color: "#ffffff",
        },
        {
          text: "Total debit",
          bold: true,
          fontSize: 11,
          fillColor: "grey",
          color: "#ffffff",
        },
        {
          text: "Closing balance",
          bold: true,
          fontSize: 11,
          fillColor: "grey",
          color: "#ffffff",
        },
      ],
    ];

    body.push([
      {
        text: this.currencyPipe.transform(this.register.opening_balance),
        alignment: "center",
        bold: true,
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(this.totalCredit),
        alignment: "center",
        bold: true,
        fillColor: "#66bb6a",
        color: "#ffffff",
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(this.totalDebit),
        alignment: "center",
        bold: true,
        fillColor: "red",
        color: "#ffffff",
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(this.calculateClosingBalance()),
        alignment: "center",
        bold: true,
        fontSize: 10,
      },
    ]);

    return {
      table: {
        widths: widths,
        body,
      },
      layout: {
        hLineWidth: (i: number) => (i === 0 || i === body.length ? 1 : 0.5),
        vLineWidth: () => 0.5,
        hLineColor: () => "#CCCCCC",
        vLineColor: () => "#CCCCCC",
        paddingLeft: () => 8,
        paddingRight: () => 8,
        paddingTop: () => 6,
        paddingBottom: () => 6,
      },
    };
  }

  async generatePdf2() {
    await this.loadPdfMake(); // Assure que pdfMake est chargé
    const imageUrl = "assets/images/almapps-logo.png";
    const formattedDate = this.datePipe.transform(
      this.register.date,
      "dd/MM/yyyy",
    );
    console.log(formattedDate);

    try {
      const base64ImageString =
        await this.imageHelper.getBase64ImageFromURL(imageUrl);

      const rotatedImage = await this.rotateBase64Image(base64ImageString, -45);

      const docDefinition = {
        pageSize: "A4",
        pageMargins: [40, 90, 40, 80],

        background: [
          {
            image: rotatedImage,
            width: 300, // A4 width
            height: 600, // A4 height
            absolutePosition: { x: 100, y: 50 },
            opacity: 0.07,
          },
        ],
        header: (currentPage: number) => {
          return {
            margin: [0, 0, 0, 0],
            stack: [
              {
                canvas: [
                  {
                    type: "rect",
                    x: 0,
                    y: 0,
                    w: 595, // A4 width
                    h: 80, // header height
                    color: "#bdbdbd",
                  },
                ],
              },
              {
                columns: [
                  {
                    image: base64ImageString,
                    width: 150,
                    margin: [0, 2, 0, 0],
                    absolutePosition: { y: 30 },
                    alignment: "center",
                  },
                ],
              },
            ],
          };
        },

        content: [
          {
            text: "DAILY TRANSACTIONS",
            alignment: "center",
            fontSize: 18,
            bold: true,
            color: "#1E3A8A",
          },
          {
            text: `Date: ${formattedDate}`,
            alignment: "center",
            fontSize: 14,
            bold: true,
            margin: [0, 5, 0, 0],
          },
          { text: "", margin: [0, 30, 0, 0] },
          // ... more details
          this.buildItemsTable(),
          { text: "", margin: [0, 30, 0, 0] },
          this.buildClosingStatsTable(),
          {
            text: `Amount in leters: ${this.currencyWordPipe.transform(
              this.calculateClosingBalance(),
            )} FCFA`,
            margin: [0, 15, 0, 0],
            bold: true,
            fontSize: 12,
          },
          {
            text: `Printed by: ${this.user.username}`,
            margin: [0, 30, 0, 0],
            italics: true,
            alignment: "left",
            fontSize: 9,
          },
        ],
        styles: {
          header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
          subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
          total: { bold: true, marginTop: 20 },
        },
        // Optional: Add page numbers in the footer
        footer: (currentPage: number, pageCount: number) => ({
          margin: [40, 0, 40, 20],
          stack: [
            {
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 0,
                  x2: 515, // A4 width minus margins
                  y2: 0,
                  lineWidth: 1,
                  lineColor: "#9CA3AF",
                },
              ],
            },
            {
              columns: [
                {
                  width: "80%",
                  text: `${this.company.rc} | ${this.company.po_box} | ${this.company.phone} | ${this.company.email} | ${this.company.nui} | ${this.company.bank_name} | ${this.company.bank_iban} | www.almapps.com`,
                  italics: true,
                  fontSize: 8,
                  margin: [5, 5, 0, 0],
                  color: "#616161",
                },
                {
                  text: `${currentPage} of ${pageCount}`,
                  alignment: "right",
                  fontSize: 8,
                  margin: [5, 5, 0, 0],
                  color: "#616161",
                },
              ],
            },
          ],
        }),
      };
      this.pdfMake.createPdf(docDefinition).open();
    } catch (error) {
      console.error("Printing error: ", error);
    }
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
