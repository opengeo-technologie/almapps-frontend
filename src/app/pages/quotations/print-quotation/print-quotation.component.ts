import { Component, ElementRef, ViewChild } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
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
    private apiService: QuotationService
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
        // console.log(po);
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
