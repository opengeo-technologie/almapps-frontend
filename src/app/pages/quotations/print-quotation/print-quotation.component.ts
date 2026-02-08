import { Component, ElementRef, ViewChild } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { PurchaseOrderService } from "../../../services/purchase-order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomCurrencyPipe } from "../../../pipes/currency.pipe";
import { CurrencyToWOrdPipe } from "../../../pipes/currency_to_word.pipe";
import { QRCodeComponent } from "angularx-qrcode";
// Types
import type * as pdfMakeType from "pdfmake/build/pdfmake";
import type * as pdfFontsType from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import * as html2canvas from "html2canvas";
import { QuotationService } from "../../../services/quotation.service";
import { ImageHelperService } from "../../../services/image-helper.service";

@Component({
  selector: "app-print-quotation",
  imports: [
    BaseComponent,
    FormsModule,
    CommonModule,
    CustomCurrencyPipe,
    CurrencyToWOrdPipe,
    QRCodeComponent,
  ],
  standalone: true,
  templateUrl: "./print-quotation.component.html",
  styleUrl: "./print-quotation.component.css",
  providers: [DatePipe, CustomCurrencyPipe, CurrencyToWOrdPipe],
})
export class PrintQuotationComponent {
  po: any | undefined;
  private pdfMake: typeof pdfMakeType | null = null;
  showQr = false;
  @ViewChild("poDiv") poDiv!: ElementRef;

  submenus: any[] = [
    {
      url: "/Company-infos",
      name: "Company informations",
      icon: "information.svg",
    },
    {
      url: "/purchase-orders/list",
      name: "Purchase Order",
      icon: "requisition.svg",
    },
    {
      url: "/quotations/list",
      name: "Quotations",
      icon: "file-setting.svg",
    },
    {
      url: "/invoices/list",
      name: "Invoices",
      icon: "002-invoice.svg",
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: QuotationService,
    private imageHelper: ImageHelperService,
    private datePipe: DatePipe,
    private currencyPipe: CustomCurrencyPipe,
    private currencyWordPipe: CurrencyToWOrdPipe
  ) {
    this.loadPdfMake();
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    const id_quotation: string | null = this.route.snapshot.paramMap.get("id");
    if (id_quotation) {
      // console.log(clientId);
      this.apiService.getQuotation(+id_quotation).subscribe((po) => {
        // console.log(po.body);
        this.po = po.body;
      });
    } else {
      this.po = undefined;
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

  private buildItemsTable(currency: string = "FCFA") {
    let body: any[] = [];
    let widths: any[] = [];
    let grandTotal = 0;
    if (this.po.products.length != 0) {
      widths = ["auto", "*", "auto", "auto", "auto"];
      body = [
        [
          { text: "#", bold: true, fontSize: 11 },
          { text: "Description", bold: true, fontSize: 11 },
          { text: "Quantity", bold: true, fontSize: 11 },
          { text: "Unit Price", bold: true, fontSize: 11 },
          { text: "Total", bold: true, fontSize: 11 },
        ],
      ];

      this.po.products.forEach((item: any, index: any) => {
        const total = item.quantity * item.unit_price;
        grandTotal += total;

        body.push([
          { text: `${index + 1}`, fontSize: 10 },
          { text: `${item.product.name}`, fontSize: 10 },
          { text: `${item.quantity}`, alignment: "right", fontSize: 10 },
          {
            text: `${this.currencyPipe.transform(item.unit_price)}`,
            alignment: "right",
            fontSize: 10,
          },
          {
            text: `${this.currencyPipe.transform(total)}`,
            alignment: "right",
            fontSize: 10,
          },
        ]);
      });
      body.push([
        {
          text: "Total without VAT",
          colSpan: 4,
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
        {},
        {},
        {},
        {
          text: this.currencyPipe.transform(this.calculateTotalWithouxVAT()),
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
      ]);

      body.push([
        {
          text: "VAT ( 19.25% )",
          colSpan: 4,
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
        {},
        {},
        {},
        {
          text: this.currencyPipe.transform(this.calculateVATAmount()),
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
      ]);

      body.push([
        {
          text: "TOTAL",
          colSpan: 4,
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
        {},
        {},
        {},
        {
          text: this.currencyPipe.transform(this.calculateTotal()),
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
      ]);
    } else {
      widths = ["auto", "*", "auto", "auto", "auto"];
      body = [
        [
          { text: "#", bold: true, fontSize: 11 },
          { text: "Description", bold: true, fontSize: 11 },
          { text: "Quantity", bold: true, fontSize: 11 },
          { text: "Unit Price", bold: true, fontSize: 11 },
          { text: "Total", bold: true, fontSize: 11 },
        ],
      ];
      this.po.services.forEach((item: any, index: any) => {
        const total = item.quantity * item.unit_price;
        grandTotal += total;

        body.push([
          { text: `${index + 1}`, fontSize: 10 },
          { text: `${item.service}`, fontSize: 10 },
          { text: `${item.quantity}`, alignment: "right", fontSize: 10 },
          {
            text: `${this.currencyPipe.transform(item.unit_price)}`,
            alignment: "right",
            fontSize: 10,
          },
          {
            text: `${this.currencyPipe.transform(total)}`,
            alignment: "right",
            fontSize: 10,
          },
        ]);
      });
      body.push([
        {
          text: "Total without VAT",
          colSpan: 4,
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
        {},
        {},
        {},
        {
          text: this.currencyPipe.transform(this.calculateTotalWithouxVAT()),
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
      ]);

      body.push([
        {
          text: "VAT ( 19.25% )",
          colSpan: 4,
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
        {},
        {},
        {},
        {
          text: this.currencyPipe.transform(this.calculateVATAmount()),
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
      ]);

      body.push([
        {
          text: "TOTAL",
          colSpan: 4,
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
        {},
        {},
        {},
        {
          text: this.currencyPipe.transform(this.calculateTotal()),
          alignment: "right",
          bold: true,
          fontSize: 10,
        },
      ]);
    }

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
      this.po.date_op,
      "dd/MM/yyyy"
    );

    try {
      const base64ImageString = await this.imageHelper.getBase64ImageFromURL(
        imageUrl
      );

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
          if (currentPage !== 1) {
            return {
              text: `Invoice #: ${this.po.reference}`,
              alignment: "right",
              fontSize: 8,
              bold: true,
            }; // ⛔ no header on other pages
          }

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
                  // {
                  //   text: "INVOICE",
                  //   alignment: "right",
                  //   margin: [0, 40, 100, 100],
                  //   absolutePosition: { y: 30 },
                  //   fontSize: 18,
                  //   bold: true,
                  //   color: "#1E3A8A",
                  // },
                ],
              },
            ],
          };
        },

        content: [
          {
            text: "QUOTATION",
            alignment: "center",
            fontSize: 18,
            bold: true,
            color: "#1E3A8A",
          },
          {
            text: `Quotation #: ${this.po.reference}`,
            alignment: "right",
            fontSize: 12,
            bold: true,
          },
          {
            text: `Date: ${formattedDate}`,
            alignment: "right",
            fontSize: 12,
            bold: true,
            margin: [0, 5, 0, 0],
          },
          { text: "", margin: [0, 30, 0, 0] },
          {
            columns: [
              [
                {
                  stack: [
                    {
                      canvas: [
                        {
                          type: "rect",
                          x: 0,
                          y: 0,
                          w: 200, // A4 width
                          h: 20, // header height
                          color: "#1E3A8A",
                        },
                      ],
                    },
                    {
                      columns: [
                        {
                          text: "Client:",
                          bold: true,
                          margin: [0, 10, 0, 0],
                          absolutePosition: { x: 110, y: 176 },
                          color: "white",
                        },
                      ],
                    },
                  ],
                },
                {
                  text: this.po.client.name,
                  margin: [0, 5, 0, 0],
                  fontSize: 9,
                  bold: true,
                },
                { text: this.po.client.email, fontSize: 9, bold: true },
                { text: this.po.client.address, fontSize: 9, bold: true },
                { text: this.po.client.phone, fontSize: 9, bold: true },
              ],
              [
                {
                  stack: [
                    {
                      canvas: [
                        {
                          type: "rect",
                          x: 60,
                          y: 0,
                          w: 200, // A4 width
                          h: 20, // header height
                          color: "#1E3A8A",
                        },
                      ],
                    },
                    {
                      columns: [
                        {
                          text: "Deliver to adress:",
                          bold: true,
                          margin: [0, 10, 0, 0],
                          absolutePosition: { x: 430, y: 176 },
                          color: "white",
                        },
                      ],
                    },
                  ],
                },
                {
                  text: this.po.company.name,
                  margin: [0, 5, 0, 0],
                  alignment: "right",
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: this.po.company.address,
                  alignment: "right",
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: this.po.company.po_box,
                  alignment: "right",
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: this.po.company.contact_name,
                  alignment: "right",
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: `${this.po.company.contact_phone1}`,
                  alignment: "right",
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: `${this.po.company.contact_email1}`,
                  alignment: "right",
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: `${this.po.company.contact_email2}`,
                  alignment: "right",
                  fontSize: 9,
                  bold: true,
                },
              ],
            ],
          },
          { text: "", margin: [0, 60, 0, 0] },
          // ... more details
          this.buildItemsTable(),
          {
            text: `Amount in leters: ${this.currencyWordPipe.transform(
              this.calculateTotal()
            )} ${this.po.currency_used}`,
            margin: [0, 15, 0, 0],
            bold: true,
            fontSize: 12,
          },
          {
            text: "Yours sincerely",
            margin: [0, 30, 0, 0],
            italics: true,
            fontSize: 12,
          },
          // {
          //   text: this.po.user.username,
          //   margin: [0, 5, 0, 0],
          //   italics: true,
          //   fontSize: 9,
          // },
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
                  text: `${this.po.company.rc} | ${this.po.company.po_box} | ${this.po.company.phone} | ${this.po.company.email} | ${this.po.company.nui} | ${this.po.company.bank_name} | ${this.po.company.bank_iban} | www.almapps.com`,
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
      console.error("Error: ", error);
    }
  }

  calculateTotalAmountProduct(item: any): number {
    return item.quantity * item.unit_price;
  }

  calculateTotalWithouxVAT(): number {
    let result = 0;
    if (this.po.products.length != 0) {
      for (let item of this.po.products) {
        result += this.calculateTotalAmountProduct(item);
      }
    } else {
      for (let item of this.po.services) {
        result += this.calculateTotalAmountProduct(item);
      }
    }

    return result;
  }

  calculateDiscount(): number {
    return (this.calculateTotalWithouxVAT() * this.po.discount_percent) / 100;
  }

  calculateTotalWithouxVATDiscount(): number {
    return this.calculateTotalWithouxVAT() - this.calculateDiscount();
  }

  calculateVATAmount(): number {
    if (this.po.discount_status) {
      return (
        (this.calculateTotalWithouxVATDiscount() + this.po.delivery_amount) *
        0.1925
      );
    } else {
      return (
        (this.calculateTotalWithouxVAT() + this.po.delivery_amount) * 0.1925
      );
    }
  }

  calculateTotal(): number {
    if (this.po.tva_status && this.po.discount_status) {
      return Math.round(
        this.calculateTotalWithouxVATDiscount() +
          this.po.delivery_amount +
          this.calculateVATAmount()
      );
    }
    if (this.po.tva_status && !this.po.discount_status) {
      return Math.round(
        this.calculateTotalWithouxVAT() + this.calculateVATAmount()
      );
    }
    if (this.po.discount_status) {
      return Math.round(
        this.calculateTotalWithouxVATDiscount() + this.po.delivery_amount
      );
    }

    return Math.round(this.calculateTotalWithouxVAT());
  }
}
