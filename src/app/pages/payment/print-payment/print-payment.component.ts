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
import { PaymentService } from "../../../services/payment.service";
import { CompanyDetailService } from "../../../services/company-detail.service";
import { ImageHelperService } from "../../../services/image-helper.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-print-payment",
  imports: [
    BaseComponent,
    FormsModule,
    CommonModule,
    CustomCurrencyPipe,
    CurrencyToWOrdPipe,
    QRCodeComponent,
  ],
  standalone: true,
  templateUrl: "./print-payment.component.html",
  styleUrl: "./print-payment.component.css",
  providers: [DatePipe, CustomCurrencyPipe, CurrencyToWOrdPipe],
})
export class PrintPaymentComponent {
  payment: any | undefined;
  private pdfMake: typeof pdfMakeType | null = null;
  showQr = false;
  @ViewChild("poDiv") poDiv!: ElementRef;
  paymentsDone: any[] = [];

  user: any | undefined;
  company: any | undefined;

  submenus: any[] = [
    {
      url: "/payments/list",
      name: "Payments",
      icon: "013-payment-method.svg",
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: PaymentService,
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
    const id_payment: string | null = this.route.snapshot.paramMap.get("id");
    if (id_payment) {
      // console.log(clientId);
      this.apiService.getPayment(+id_payment).subscribe((payment) => {
        // console.log(payment);
        this.payment = payment;
        this.apiService
          .getInvoicesPaymentById(payment.invoice.id)
          .subscribe((invoice) => {
            this.paymentsDone = invoice.payments;
          });
      });
    } else {
      this.payment = undefined;
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

  calculateInvoiceAmount(item: any) {
    let result = item.amount;
    if (item.tva_status) {
      result += item.amount * 0.1925;
    }

    return result;
  }

  calculateTotalPaymentRemain() {
    let result = 0;
    for (let item of this.paymentsDone) {
      result += item.amount;
    }
    return this.calculateInvoiceAmount(this.payment.invoice) - result;
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

  private buildClosingStatsTable() {
    let body: any[] = [];
    let widths: any[] = [];
    let grandTotal = 0;
    const formattedDate = this.datePipe.transform(
      this.payment.date_op,
      "dd/MM/yyyy",
    );
    widths = ["*", "*", "*"];
    body = [
      [
        {
          text: "Reference",
          bold: true,
          fontSize: 11,
        },
        {
          text: "Invoice Amount",
          bold: true,
          fontSize: 11,
        },
        {
          text: "Paid amount",
          bold: true,
          fontSize: 11,
        },
      ],
    ];

    body.push([
      {
        text: this.payment.invoice.reference,
        alignment: "center",
        bold: true,
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(
          this.calculateInvoiceAmount(this.payment.invoice),
        ),
        alignment: "center",
        bold: true,
        fontSize: 10,
      },
      {
        text: this.currencyPipe.transform(this.payment.amount),
        alignment: "center",
        bold: true,
        fontSize: 10,
      },
    ]);

    body.push([
      {
        text: "Balance",
        colSpan: 2,
        alignment: "left",
        bold: true,
        color: "red",
        fontSize: 10,
      },
      {},
      {
        text: this.currencyPipe.transform(this.calculateTotalPaymentRemain()),
        alignment: "center",
        bold: true,
        color: "red",
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
      this.payment.date_op,
      "dd/MM/yyyy",
    );
    console.log(formattedDate);

    try {
      const base64ImageString =
        await this.imageHelper.getBase64ImageFromURL(imageUrl);

      const rotatedImage = await this.rotateBase64Image(base64ImageString, -45);

      const docDefinition = {
        pageSize: {
          width: 595,
          height: 550,
        },
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
            text: "RECEIPT",
            alignment: "center",
            fontSize: 18,
            bold: true,
            color: "#1E3A8A",
          },
          {
            columns: [
              {
                text: "Client",
                fontSize: 13,
                bold: true,
                decoration: "underline",
                margin: [0, 5, 0, 0],
              },
              {
                text: `Date: ${formattedDate}`,
                alignment: "right",
                fontSize: 10,
                bold: true,
                margin: [0, 5, 0, 0],
              },
            ],
          },
          {
            columns: [
              {
                text: `Name: ${this.payment.invoice.client.name}`,
                fontSize: 10,
                bold: true,
                margin: [0, 5, 0, 0],
              },
              {
                text: `Reference: ${this.payment.reference}`,
                alignment: "right",
                fontSize: 10,
                bold: true,
                margin: [0, 5, 0, 0],
              },
            ],
          },
          {
            text: `Email: ${this.payment.invoice.client.email}`,
            fontSize: 10,
            bold: true,
            margin: [0, 5, 0, 0],
          },
          {
            text: `Address: ${this.payment.invoice.client.address}`,
            fontSize: 10,
            bold: true,
            margin: [0, 5, 0, 0],
          },
          {
            text: `Phone: ${this.payment.invoice.client.phone}`,
            fontSize: 10,
            bold: true,
            margin: [0, 5, 0, 0],
          },
          { text: "", margin: [0, 30, 0, 0] },
          // ... more details
          this.buildClosingStatsTable(),
          {
            text: `Amount in leters: ${this.currencyWordPipe.transform(
              this.payment.amount,
            )} FCFA`,
            margin: [0, 15, 0, 0],
            bold: true,
            fontSize: 12,
          },
          {
            columns: [
              {
                text: "Client signature",
                margin: [0, 30, 0, 0],
                italics: true,
                alignment: "left",
                fontSize: 11,
              },
              {
                text: "Company signature",
                margin: [0, 30, 0, 0],
                italics: true,
                alignment: "right",
                fontSize: 11,
              },
            ],
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
}
