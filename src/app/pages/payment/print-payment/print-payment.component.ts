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
import { PaymentService } from "../../../services/payment.service";

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
})
export class PrintPaymentComponent {
  payment: any | undefined;
  private pdfMake: typeof pdfMakeType | null = null;
  showQr = false;
  @ViewChild("poDiv") poDiv!: ElementRef;
  paymentsDone: any[] = [];

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
    private apiService: PaymentService
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
}
