import { HttpEventType } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { ClientService } from "../../../services/client.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { PurchaseOrderService } from "../../../services/purchase-order.service";
import { ProductService } from "../../../services/product.service";
import { CompanyDetailService } from "../../../services/company-detail.service";
import { InvoiceService } from "../../../services/invoice.service";
import { JobsService } from "../../../services/jobs.service";
import { TechnicianService } from "../../../services/technician.service";
import { generateArrayOfYears } from "../../../constants/app.functions";
import { PaymentService } from "../../../services/payment.service";
declare var M: any;

@Component({
  selector: "app-form-payment",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-payment.component.html",
  styleUrl: "./form-payment.component.css",
})
export class FormPaymentComponent {
  @Input() payment: any;
  isAddForm: boolean;
  clients: any[] = [];
  invoices: any[] = [];
  types: any[] = [];
  maxAmount: any = 0;

  products: any[] = [];
  // clientForm: NgForm;
  order_product: any = {
    product: null,
    unit_price: 0,
    quantity: 0,
  };

  invoice_technicians: any = {
    technician: null,
    normal_hour1: 0,
    normal_hour2: 0,
    normal_unit_price: 0,
    overtime_hour1: 0,
    overtime_hour2: 0,
    overtime_unit_price: 0,
    allowance_hour1: 0,
    allowance_hour2: 0,
    allowance_unit_price: 0,
  };

  invoice_service: any = {
    service: "",
    unit_price: 0,
    quantity: 0,
  };

  job: any = {
    job_name: "",
    job_description: "",
    duration: 0,
    price: 0,
  };
  selected_year_invoice: number = 0;

  company: any;
  invoice_selected: any = null;
  po: any;

  billing_amount: any = 0;

  current_currency: any = {
    id: "XAF",
    value: "FCFA",
    locale: "fr-FR",
  };

  currencies: any[] = [
    {
      id: "XAF",
      value: "FCFA",
      locale: "fr-FR",
    },
    {
      id: "USD",
      value: "Dollar",
      locale: "en-EN",
    },
    {
      id: "EUR",
      value: "Euro",
      locale: "en-EN",
    },
  ];

  years = generateArrayOfYears();

  constructor(
    private paymentService: PaymentService,
    private productService: ProductService,
    private clientService: ClientService,
    private companyService: CompanyDetailService,
    private invoiceService: InvoiceService,
    private jobService: JobsService,
    private techService: TechnicianService,
    private router: Router
  ) {
    // console.log(this.years);
    this.isAddForm = this.router.url.includes("add");
    this.clientService.getClients().subscribe((clients: any[]) => {
      // console.log(clients);
      this.clients = clients;
    });

    this.paymentService.getInvoicesPayments().subscribe((invoices: any[]) => {
      // console.log(invoices);
      this.invoices = invoices;
    });

    this.productService.getProducts().subscribe((products: any[]) => {
      this.products = products;
    });

    this.paymentService.getPaymentMethods().subscribe((types: any[]) => {
      this.types = types;
    });
  }

  ngOnInit() {
    this.selected_year_invoice = new Date().getFullYear();
  }

  ngAfterContentInit(): void {
    if (this.isAddForm) {
      this.payment.currency = this.current_currency;
      this.companyService.getActiveCompanyDetail().subscribe((company: any) => {
        // console.log(company);
        this.company = company;
        this.payment.company_id = this.company.id;
      });

      this.paymentService
        .generateNextReference()
        .subscribe((reference: any) => {
          this.payment.reference = reference.next_reference;
        });
    } else {
    }
  }

  get getFilteredInvoices() {
    return this.invoices.filter((el) => {
      const yearInvoice = new Date(el.date_op).getFullYear();
      let diff_invoice_payment = this.calculateInvoiceAmount(el);
      if (el.payments.length != 0) {
        diff_invoice_payment =
          this.calculateInvoiceAmount(el) -
          this.calculateTotalPayment(el.payments);
      }

      // console.log(diff_invoice_payment);
      return (
        yearInvoice == this.selected_year_invoice && diff_invoice_payment != 0
      );
    });

    // return filteredJobs;
  }

  calculateTotalPayment(items: any[]) {
    let result = 0;
    for (let item of items) {
      result += item.amount;
    }
    return result;
  }

  calculateInvoiceAmount(item: any) {
    let result = item.amount;
    if (item.tva_status) {
      result += item.amount * 0.1925;
    }

    return result;
  }

  changeInvoice() {
    // console.log(this.invoice_selected);
    this.billing_amount =
      this.calculateInvoiceAmount(this.invoice_selected) -
      this.calculateTotalPayment(this.invoice_selected.payments);

    this.maxAmount = this.billing_amount;
    this.payment.amount = this.maxAmount;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id && c1.type === c2.type : c1 === c2;
  }

  compareClient(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  print(po: any) {
    this.router.navigate(["/invoices/print", po.id]);
  }

  onSubmit() {
    this.payment.invoice_id = this.invoice_selected.id;
    this.payment.currency_used = this.payment.currency.id;
    this.payment.locale_currency = this.payment.currency.locale;
    this.payment.method_id = this.payment.type.id;
    delete this.payment.currency;
    delete this.payment.type;
    // console.log(this.payment);
    if (this.isAddForm) {
      this.paymentService.savePayment(this.payment).subscribe({
        next: (data) => {
          // console.log(data.status);

          if (data.status == 201) {
            // Handle the response from the server
            this.paymentService
              .getInvoicesPaymentById(this.invoice_selected.id)
              .subscribe((invoice: any) => {
                // console.log(invoice);
                if (data.status == 201) {
                  const diff =
                    this.calculateInvoiceAmount(invoice) -
                    this.calculateTotalPayment(invoice.payments);
                  if (diff == 0) {
                    invoice.status = true;
                    this.invoiceService.updateInvoice(invoice).subscribe({
                      next: (data) => {},
                    });
                  }
                }
              });
            M.toast({
              html: "Data created successfully....",
              classes: "rounded green accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            // this.loadItems();
            this.router.navigate(["/payments/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    } else {
    }
  }
}
