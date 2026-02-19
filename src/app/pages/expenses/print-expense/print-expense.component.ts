import { Component, ElementRef, ViewChild } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
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
import { CompanyDetailService } from "../../../services/company-detail.service";
import { ImageHelperService } from "../../../services/image-helper.service";
import { AuthService } from "../../../services/auth.service";
import { color } from "html2canvas/dist/types/css/types/color";

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
  providers: [DatePipe, CustomCurrencyPipe, CurrencyToWOrdPipe],
})
export class PrintExpenseComponent {
  expense: any | undefined;
  private pdfMake: typeof pdfMakeType | null = null;
  showQr = false;
  user: any | undefined;
  company: any | undefined;
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
    private apiService: ExpenseService,
    private companyService: CompanyDetailService,
    private imageHelper: ImageHelperService,
    private datePipe: DatePipe,
    private currencyPipe: CustomCurrencyPipe,
    private currencyWordPipe: CurrencyToWOrdPipe,
    private authService: AuthService,
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
        // console.log(expense);
        this.expense = expense;
      });
    } else {
      this.expense = undefined;
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

  private async loadPdfMake() {
    if (this.pdfMake) return;

    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfFontsModule = await import("pdfmake/build/vfs_fonts");

    const pdfMake = pdfMakeModule.default;
    pdfMake.vfs = pdfFontsModule.default.vfs;

    this.pdfMake = pdfMake;
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

  private buildTasksTable() {
    let body: any[] = [];
    let widths: any[] = [];
    widths = ["*", "*"];
    body = [
      [
        {
          text: "Task",
          bold: true,
          fontSize: 11,
        },
        {
          text: "Amount",
          alignment: "right",
          bold: true,
          fontSize: 11,
        },
      ],
    ];

    this.expense.tasks.forEach((item: any, index: any) => {
      body.push([
        {
          text: item.task,
          bold: true,
          fontSize: 10,
        },
        {
          text: this.currencyPipe.transform(item.amount),
          alignment: "right",
          fontSize: 10,
        },
      ]);
    });
    body.push([
      {
        text: "Total",
        alignment: "right",
        bold: true,
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(this.calculateTotalExpense()),
        alignment: "right",
        bold: true,
        color: "#000000",
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

  private buildTechnicianTable() {
    let body: any[] = [];
    let widths: any[] = [];
    widths = ["*", "*", "*", "*"];

    body.push([
      {
        text: "Technician name",
        bold: true,
        fontSize: 10,
      },
      {
        text: "Amount set for job",
        alignment: "right",
        bold: true,
        fontSize: 10,
      },
      {
        text: "Total expenses",
        alignment: "right",
        bold: true,
        fontSize: 10,
      },
      {
        text: "Balance",
        alignment: "right",
        bold: true,
        fontSize: 10,
      },
    ]);

    body.push([
      {
        text: this.expense.tasks[0].job_assign.technician.name,
        bold: true,
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(
          this.expense.tasks[0].job_assign.amount,
        ),
        alignment: "right",
        fillColor: "#2196f3",
        color: "#ffffff",
        bold: true,
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(this.calculateTotalExpense()),
        alignment: "right",
        fillColor: "#f44336",
        color: "#ffffff",
        bold: true,
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(
          this.expense.tasks[0].job_assign.amount -
            this.calculateTotalExpense(),
        ),
        alignment: "right",
        fillColor: "#4caf50",
        color: "#ffffff",
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

  private buildInvoiceTable() {
    let body: any[] = [];
    let widths: any[] = [];
    widths = ["*", "*", "*", "*", "*"];

    body.push([
      {
        text: "Invoice Reference",
        bold: true,
        fontSize: 10,
      },
      {
        text: "Client name",
        bold: true,
        fontSize: 10,
      },
      {
        text: "Amount",
        alignment: "right",
        bold: true,
        fontSize: 10,
      },
      {
        text: "Total expenses",
        alignment: "right",
        bold: true,
        fontSize: 10,
      },
      {
        text: "Balance",
        alignment: "right",
        bold: true,
        fontSize: 10,
      },
    ]);

    body.push([
      {
        text: this.expense.invoice.reference,
        bold: true,
        fontSize: 10,
      },
      {
        text: this.expense.invoice.client.name,
        bold: true,
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(this.calculateTotalInvoice()),
        alignment: "right",
        fillColor: "#2196f3",
        color: "#ffffff",
        bold: true,
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(this.calculateTotalExpense()),
        alignment: "right",
        fillColor: "#f44336",
        color: "#ffffff",
        bold: true,
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(
          this.calculateTotalInvoice() - this.calculateTotalExpense(),
        ),
        alignment: "right",
        fillColor: "#4caf50",
        color: "#ffffff",
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
      this.expense.date,
      "dd/MM/yyyy",
    );

    try {
      const base64ImageString =
        await this.imageHelper.getBase64ImageFromURL(imageUrl);

      const rotatedImage = await this.rotateBase64Image(base64ImageString, -45);

      const docDefinition = {
        pageSize: "A4",
        pageMargins: [40, 60, 40, 80],

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
                    h: 50, // header height
                    color: "#bdbdbd",
                  },
                ],
              },
              {
                columns: [
                  {
                    image: base64ImageString,
                    width: 100,
                    margin: [0, 2, 0, 0],
                    absolutePosition: { y: 15 },
                    alignment: "center",
                  },
                ],
              },
            ],
          };
        },

        content: [
          {
            text: "EXPENSE REPORT",
            alignment: "center",
            fontSize: 18,
            bold: true,
            color: "#1E3A8A",
          },
          {
            text: `Date: ${formattedDate}`,
            alignment: "right",
            fontSize: 10,
            bold: true,
            margin: [0, 5, 0, 0],
          },
          {
            text: `Reference: ${this.expense.reference}`,
            alignment: "right",
            fontSize: 10,
            bold: true,
            margin: [0, 5, 0, 0],
          },
          { text: "", margin: [0, 30, 0, 0] },
          // ... more details
          {
            margin: [0, 0, 0, 10],
            stack: [
              {
                canvas: [
                  {
                    type: "rect",
                    x: 0,
                    y: 0,
                    w: 515, // A4 width
                    h: 20, // header height
                    color: "#bdbdbd",
                  },
                ],
              },
              {
                text: `${this.expense.label}`,
                margin: [0, 2, 0, 0],
                absolutePosition: { y: 148 },
                alignment: "center",
                bold: true,
                color: "#000000",
                fontSize: 12,
              },
            ],
          },
          this.buildTasksTable(),
          { text: "", margin: [0, 30, 0, 0] },
          this.expense.type_expense == "job_assign"
            ? this.buildTechnicianTable()
            : {},

          this.expense.type_expense == "invoice"
            ? this.buildInvoiceTable()
            : {},
          {
            text: `Amount in letters: ${this.currencyWordPipe.transform(
              this.calculateTotalExpense(),
            )} FCFA`,
            margin: [0, 15, 0, 0],
            bold: true,
            fontSize: 12,
          },
          { text: "", margin: [0, 65, 0, 0] },
          {
            text: `Printed by: ${this.user.username}`,
            margin: [0, 0, 0, 0],
            italics: true,
            alignment: "right",
            fontSize: 6,
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

  groupJobAssignTasksPerTechnician() {}

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
        this.calculateVATAmount(),
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
