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
import { AuthService } from "../../../services/auth.service";
declare var M: any;

@Component({
  selector: "app-form-invoice",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-invoice.component.html",
  styleUrl: "./form-invoice.component.css",
})
export class FormInvoiceComponent {
  @Input() invoice: any;
  isAddForm: boolean;
  isGeneratingPDF: boolean = false;
  clients: any[] = [];
  technicians: any[] = [];
  types: any[] = [];

  user: any;

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

  jobs_list: any[] = [];
  removed_from_jobs_list: any[] = [];
  order_products_list: any[] = [];
  invoice_technician_list: any[] = [];
  removed_order_products_list: any[] = [];
  removed_invoice_technician_list: any[] = [];
  selectedTypeId: number = 0;
  response: boolean = false;
  hasHeading: boolean = false;
  isVAT: boolean = false;
  hasPo: boolean = false;

  company: any;
  po: any;

  totalAmount: any = 0;

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

  constructor(
    private poService: PurchaseOrderService,
    private productService: ProductService,
    private clientService: ClientService,
    private companyService: CompanyDetailService,
    private invoiceService: InvoiceService,
    private jobService: JobsService,
    private techService: TechnicianService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAddForm = this.router.url.includes("add");
    this.clientService.getClients().subscribe((clients: any[]) => {
      // console.log(clients);
      this.clients = clients;
    });

    this.poService.getPurchaseOrders().subscribe((po: any) => {
      // console.log(company);
      this.po = po;
    });

    this.productService.getProducts().subscribe((products: any[]) => {
      this.products = products;
    });

    this.invoiceService.getInvoiceTypes().subscribe((types: any[]) => {
      this.types = types;
    });

    this.techService.getTechnicians().subscribe((technicians: any[]) => {
      this.technicians = technicians;
    });
  }

  ngOnInit() {
    // console.log(this.client);
    // this.isClientInformation = true;
    // console.log(this.client);
  }

  ngAfterContentInit(): void {
    if (this.isAddForm) {
      this.invoice.currency = this.current_currency;
      this.companyService.getActiveCompanyDetail().subscribe((company: any) => {
        // console.log(company);
        this.company = company;
        this.invoice.company_id = this.company.id;
      });

      // this.invoiceService
      //   .generateNextReference()
      //   .subscribe((reference: any) => {
      //     this.invoice.reference = reference.next_reference;
      //   });

      const userData = this.authService.getUser();
      if (userData) {
        // console.log(JSON.parse(userData));
        this.user = JSON.parse(userData);
        this.invoice.user_id = this.user.id;
      }
    } else {
      // console.log(this.invoice);
      this.invoice.currency = this.currencies.find(
        (el: any) => el.id == this.invoice.currency_used
      );
      this.isVAT = this.invoice.tva_status;
      this.hasHeading = this.invoice.has_heading;
      this.hasPo = this.invoice.has_po;
      this.invoice.company_id = this.invoice.company.id;
      if (this.invoice.purchase_order_id != null) {
        this.poService
          .getPurchaseOrder(this.invoice.purchase_order_id)
          .subscribe((po: any) => {
            // console.log(po);
            this.invoice.purchase_order = po.body;
          });
      } else {
        this.invoice.purchase_order = null;
      }

      // this.jobs_list = this.invoice.jobs;
      if (this.invoice.type.id == 1) {
        for (let item of this.invoice.jobs) {
          let element = {
            invoice_job_id: item.id,
            job_id: item.job_id,
            job_name: item.job.job_name,
            duration: item.job.duration,
            price: item.job.price,
          };
          this.jobs_list.push(element);
        }
      } else if (this.invoice.type.id == 2) {
        this.invoice_technician_list = this.invoice.technicians;
      } else if (this.invoice.type.id == 3) {
        this.order_products_list = this.invoice.products;
      }
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id && c1.type === c2.type : c1 === c2;
  }

  compareClient(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  get filteredProducts() {
    let data = [...this.products];
    return data.filter(
      (itemA) =>
        !this.order_products_list.some((itemB) => itemB.product.id === itemA.id)
    );
  }

  get filteredTechnicians() {
    let data = [...this.technicians];
    return data.filter(
      (itemA) =>
        !this.invoice_technician_list.some(
          (itemB) => itemB.technician.id === itemA.id
        )
    );
  }

  initInvoiceTechnician() {
    this.invoice_technicians = {
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
  }

  initInvoiceProduct() {
    this.order_product = {
      product: null,
      unit_price: 0,
      quantity: 0,
    };
  }

  initInvoiceJob() {
    this.job = {
      job_name: "",
      job_description: "",
      duration: 0,
      price: 0,
    };
  }

  selectedType() {
    this.order_products_list = [];
    this.invoice_technician_list = [];
    this.totalAmount = 0;
    this.initInvoiceProduct();
    this.initInvoiceTechnician();
  }

  disabledAssignJobButton() {
    return (
      this.job.job_name == null || this.job.price == 0 || this.job.duration == 0
    );
  }

  disabledAssignProductButton() {
    return (
      this.order_product.product == null ||
      this.order_product.unit_price == 0 ||
      this.order_product.quantity == 0
    );
  }

  disabledAssignTechnicianButton() {
    return (
      this.invoice_technicians.technician == null ||
      this.invoice_technicians.normal_hour1 == 0 ||
      this.invoice_technicians.overtime_hour1 == 0 ||
      this.invoice_technicians.allowance_hour1 == 0 ||
      this.invoice_technicians.normal_unit_price == 0 ||
      this.invoice_technicians.overtime_unit_price == 0 ||
      this.invoice_technicians.allowance_unit_price == 0
    );
  }

  assignJob() {
    if (this.isAddForm) {
      this.jobs_list.push(this.job);
      this.totalAmount += this.job.duration * this.job.price;
      this.job = {
        job_name: "",
        job_description: "",
        duration: 0,
        price: 0,
      };
    } else {
      const new_job = this.removed_from_jobs_list.find(
        (itemA) => this.job.id === itemA.job.id
      );
      if (new_job) {
        this.removed_order_products_list =
          this.removed_order_products_list.filter(
            (itemA) => this.job.id !== itemA.product.id
          );
        new_job.price = this.job.price;
        new_job.duration = this.job.duration;
        this.jobs_list.push(new_job);
      } else {
        this.jobs_list.push(this.job);
      }
    }
  }

  removeJobToList(job: any) {
    if (this.isAddForm) {
      this.totalAmount -= this.job.duration * this.job.price;
      this.jobs_list = this.jobs_list.filter(
        (itemA) => job.job_name !== itemA.job_name
      );
      this.job = {
        job_name: "",
        job_description: "",
        duration: 0,
        price: 0,
      };
    } else {
      this.removed_from_jobs_list.push(job);
      this.jobs_list = this.jobs_list.filter(
        (itemA) => job.invoice_job_id !== itemA.invoice_job_id
      );
      // console.log(this.order_products_list);
      this.job = {
        job_name: "",
        job_description: "",
        duration: 0,
        price: 0,
      };
    }
  }

  assignProduct() {
    if (this.isAddForm) {
      this.order_products_list.push(this.order_product);
      this.totalAmount +=
        this.order_product.quantity * this.order_product.unit_price;
      this.order_product = {
        product: null,
        unit_price: 0,
        quantity: 0,
      };
    } else {
      const new_product_order = this.removed_order_products_list.find(
        (itemA) => this.order_product.product.id === itemA.product.id
      );
      // console.log(new_product_order);
      if (new_product_order) {
        this.removed_order_products_list =
          this.removed_order_products_list.filter(
            (itemA) => this.order_product.product.id !== itemA.product.id
          );
        new_product_order.quantity = this.order_product.quantity;
        new_product_order.unit_price = this.order_product.unit_price;
        this.order_products_list.push(new_product_order);
      } else {
        this.order_products_list.push(this.order_product);
      }
      this.order_product = {
        product: null,
        unit_price: 0,
        market_price: 0,
        quantity: 0,
      };
    }
  }

  removeProductToList(order_product: any) {
    if (this.isAddForm) {
      this.totalAmount -=
        this.order_product.quantity * this.order_product.unit_price;
      this.order_products_list = this.order_products_list.filter(
        (itemA) => order_product.product.id !== itemA.product.id
      );
      this.order_product = {
        product: null,
        unit_price: 0,
        quantity: 0,
      };
    } else {
      this.removed_order_products_list.push(order_product);
      this.order_products_list = this.order_products_list.filter(
        (itemA) => order_product.product.id !== itemA.product.id
      );
      // console.log(this.order_products_list);
      this.order_product = {
        product: null,
        unit_price: 0,
        quantity: 0,
      };
    }
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

  assignTechnician() {
    if (this.isAddForm) {
      this.invoice_technician_list.push(this.invoice_technicians);
      this.totalAmount += this.calculateTotalTechnicianAmountHours(
        this.invoice_technicians
      );
      this.initInvoiceTechnician();
    } else {
      const new_service_order = this.removed_invoice_technician_list.find(
        (itemA) =>
          this.invoice_technicians.technician.id === itemA.technician.id
      );

      // console.log(new_product_order);

      if (new_service_order) {
        this.removed_invoice_technician_list =
          this.removed_invoice_technician_list.filter(
            (itemA) =>
              this.invoice_technicians.technician.id === itemA.technician.id
          );
        new_service_order.normal_hour1 = this.invoice_technicians.normal_hour1;
        new_service_order.unit_price = this.invoice_service.unit_price;
        this.invoice_technician_list.push(new_service_order);
      } else {
        this.invoice_technician_list.push(this.invoice_technicians);
      }
      this.initInvoiceTechnician();
    }
  }

  removeTechnicianToList(invoice_technicians: any) {
    if (this.isAddForm) {
      this.totalAmount -=
        this.calculateTotalTechnicianAmountHours(invoice_technicians);
      // console.log(invoice_technicians);
      // console.log(this.invoice_technician_list);
      this.invoice_technician_list = this.invoice_technician_list.filter(
        (itemA) => invoice_technicians.technician.id !== itemA.technician.id
      );
      this.initInvoiceTechnician();
    } else {
      this.removed_invoice_technician_list.push(invoice_technicians);
      this.invoice_technician_list = this.invoice_technician_list.filter(
        (itemA) => invoice_technicians.technician.id !== itemA.technician.id
      );
      this.initInvoiceTechnician();
    }
  }

  stateCheckedBoxheading(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.hasHeading = true;
    } else {
      this.hasHeading = false;
    }
  }

  stateCheckedBoxPo(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.hasPo = true;
    } else {
      this.hasPo = false;
    }
  }

  stateCheckedBoxVat(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.isVAT = true;
    } else {
      this.isVAT = false;
    }
  }

  print(invoice_id: any) {
    this.router.navigate(["/invoices/print", invoice_id]);
    // this.invoiceService.getInvoice(invoice_id).subscribe({
    //   next: (response: any) => {
    //     // console.log(response);
    //     M.toast({
    //       html: "Data updated successfully....",
    //       classes: "rounded green accent-4",
    //       inDuration: 500,
    //       outDuration: 575,
    //     });
    //     // this.loadItems();
    //     this.isGeneratingPDF = false;

    //   },
    //   error: (err: any) => console.error(err),
    // });
  }

  // onSubmit() {}

  onSubmit() {
    // console.log(this.invoice);
    this.invoice.amount = Math.round(this.totalAmount);
    this.invoice.client_id = this.invoice.client.id;
    this.invoice.type_id = this.invoice.type.id;
    this.invoice.currency_used = this.invoice.currency.id;
    this.invoice.locale_currency = this.invoice.currency.locale;
    delete this.invoice.currency;
    delete this.invoice.client;
    delete this.invoice.type;

    if (this.isVAT) {
      this.invoice.tva_status = this.isVAT;
    } else {
      this.invoice.tva_status = this.isVAT;
    }

    if (this.hasHeading) {
      this.invoice.has_heading = this.hasHeading;
    } else {
      this.invoice.has_heading = this.hasHeading;
      this.invoice.heading = "";
    }

    if (this.hasPo) {
      this.invoice.has_po = this.hasPo;
      this.invoice.purchase_order_id = this.invoice.purchase_order.id;
    } else {
      this.invoice.has_po = this.hasPo;
      delete this.invoice.purchase_order;
      delete this.invoice.purchase_order_id;
    }

    // console.log(this.order_products_list);
    if (this.isAddForm) {
      this.invoiceService.saveInvoice(this.invoice).subscribe({
        next: (data: any) => {
          // console.log(data.body.id);
          let invoice_id = data.body.id;
          if (data.status == 201) {
            // Handle the response from the server
            if (this.invoice.type_id == 1) {
              for (let item of this.jobs_list) {
                const job = {
                  job_name: item.job_name,
                  job_description: item.job_description,
                  duration: item.duration,
                  price: item.price,
                  date_program: this.invoice.date_op,
                };
                this.jobService.saveJob(job).subscribe({
                  next: (job_response: any) => {
                    const job_assign = {
                      job_id: job_response.body.id,
                      invoice_id: invoice_id,
                    };
                    this.invoiceService.saveInvoiceJob(job_assign).subscribe({
                      next: (response: any) => {},
                      error: (err: any) => console.error(err),
                    });
                  },
                  error: (err: any) => console.error(err),
                });
              }
            } else if (this.invoice.type_id == 3) {
              for (let item of this.order_products_list) {
                const invoice_product = {
                  product_id: item.product.id,
                  invoice_id: invoice_id,
                  unit_price: item.unit_price,
                  quantity: item.quantity,
                };
                this.invoiceService
                  .saveInvoiceProduct(invoice_product)
                  .subscribe({
                    next: (response: any) => {},
                    error: (err: any) => console.error(err),
                  });
              }
            } else {
              for (let item of this.invoice_technician_list) {
                item.technician_id = item.technician.id;
                item.invoice_id = invoice_id;
                delete item.technician;
                // console.log(item);
                this.invoiceService.saveInvoiceTechnician(item).subscribe({
                  next: (response: any) => {},
                  error: (err: any) => console.error(err),
                });
              }
            }
            this.isGeneratingPDF = true;
            setTimeout(() => {
              this.print(invoice_id);
              this.isGeneratingPDF = false;
            }, 500);

            // this.router.navigate(["/invoices/list"]);
          }
        },
        error: (err: any) => console.error(err),
      });
    } else {
      for (let item of this.jobs_list) {
        this.totalAmount += item.duration * item.price;
      }
      for (let item of this.order_products_list) {
        this.totalAmount += item.quantity * item.unit_price;
      }

      for (let item of this.invoice_technician_list) {
        this.totalAmount += this.calculateTotalTechnicianAmountHours(item);
      }
      this.invoice.amount = Math.round(this.totalAmount);
      this.invoiceService.updateInvoice(this.invoice).subscribe({
        next: (data: any) => {
          // console.log(data);
          let invoice_id = data.body.id;
          if (data.status == 206) {
            // Handle the response from the server
            if (this.invoice.type_id == 1) {
              for (let item of this.jobs_list) {
                if (!item.invoice_job_id) {
                  const job = {
                    job_name: item.job_name,
                    job_description: item.job_description,
                    duration: item.duration,
                    price: item.price,
                    date_program: this.invoice.date_op,
                  };
                  this.jobService.saveJob(job).subscribe({
                    next: (job_response: any) => {
                      const job_assign = {
                        job_id: job_response.body.id,
                        invoice_id: invoice_id,
                      };
                      this.invoiceService.saveInvoiceJob(job_assign).subscribe({
                        next: (response: any) => {},
                        error: (err: any) => console.error(err),
                      });
                    },
                    error: (err: any) => console.error(err),
                  });
                }
              }
              if (this.removed_from_jobs_list.length != 0) {
                for (let item of this.removed_from_jobs_list) {
                  const invoice_job = {
                    id: item.invoice_job_id,
                  };

                  const job = {
                    id: item.job_id,
                  };

                  this.jobService.deleteJob(job).subscribe({
                    next: (data: any) => {
                      this.invoiceService
                        .deleteInvoiceJob(invoice_job)
                        .subscribe({
                          next: (data: any) => {},
                          error: (err: any) => console.error(err),
                        });
                    },
                    error: (err: any) => console.error(err),
                  });
                }
              }
            } else if (this.invoice.type_id == 3) {
              for (let item of this.order_products_list) {
                if (item.id) {
                  const invoice_product = {
                    id: item.id,
                    unit_price: item.unit_price,
                    quantity: item.quantity,
                  };
                  this.invoiceService
                    .updateInvoiceProduct(invoice_product)
                    .subscribe({
                      next: (data) => {},
                      error: (err) => console.error(err),
                    });
                } else {
                  const invoice_product = {
                    product_id: item.product.id,
                    invoice_id: invoice_id,
                    unit_price: item.unit_price,
                    quantity: item.quantity,
                  };
                  this.invoiceService
                    .saveInvoiceProduct(invoice_product)
                    .subscribe({
                      next: (data) => {},
                      error: (err) => console.error(err),
                    });
                }
              }

              if (this.removed_order_products_list.length != 0) {
                for (let item of this.removed_order_products_list) {
                  const po_product = {
                    id: item.id,
                    unit_price: item.unit_price,
                    quantity: item.quantity,
                    status: true,
                  };
                  this.invoiceService
                    .deleteInvoiceProduct(po_product)
                    .subscribe({
                      next: (data) => {},
                      error: (err) => console.error(err),
                    });
                }
              }
            } else {
              for (let item of this.invoice_technician_list) {
                if (item.id) {
                  this.invoiceService.updateInvoiceTechnician(item).subscribe({
                    next: (data) => {},
                    error: (err) => console.error(err),
                  });
                } else {
                  item.technician_id = item.technician.id;
                  item.invoice_id = invoice_id;
                  delete item.technician;
                  // console.log(item);
                  this.invoiceService.saveInvoiceTechnician(item).subscribe({
                    next: (response: any) => {},
                    error: (err: any) => console.error(err),
                  });
                }
              }

              if (this.removed_invoice_technician_list.length != 0) {
                for (let item of this.removed_invoice_technician_list) {
                  this.invoiceService.deleteInvoiceTechnician(item).subscribe({
                    next: (data) => {},
                    error: (err) => console.error(err),
                  });
                }
              }
            }

            this.isGeneratingPDF = true;
            setTimeout(() => {
              this.print(invoice_id);
              this.isGeneratingPDF = false;
            }, 500);

            // this.router.navigate(["/invoices/list"]);
          }
        },
        error: (err: any) => console.error(err),
      });
    }
  }
}
