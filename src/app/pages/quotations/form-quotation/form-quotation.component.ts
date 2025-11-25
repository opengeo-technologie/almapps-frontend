import { HttpEventType } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { ClientService } from "../../../services/client.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { PurchaseOrderService } from "../../../services/purchase-order.service";
import { ProductService } from "../../../services/product.service";
import { QuotationService } from "../../../services/quotation.service";
import { CompanyDetailService } from "../../../services/company-detail.service";
declare var M: any;

@Component({
  selector: "app-form-quotation",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-quotation.component.html",
  styleUrl: "./form-quotation.component.css",
})
export class FormQuotationComponent {
  @Input() quotation: any;
  isAddForm: boolean;
  isGeneratingPDF: boolean = false;
  clients: any[] = [];
  types: any[] = [];

  products: any[] = [];
  // clientForm: NgForm;
  quotation_product: any = {
    product: null,
    unit_price: 0,
    market_price: 0,
    quantity: 0,
  };

  quotation_service: any = {
    service: "",
    unit_price: 0,
    quantity: 0,
  };

  discount_percent: number = 0;

  order_products_list: any[] = [];
  order_services_list: any[] = [];
  removed_order_products_list: any[] = [];
  removed_order_services_list: any[] = [];
  selectedTypeId: number = 0;
  response: boolean = false;
  isShipping: boolean = false;
  isVAT: boolean = false;
  isDiscount: boolean = false;

  company: any;

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
    private quotationService: QuotationService,
    private productService: ProductService,
    private clientService: ClientService,
    private companyService: CompanyDetailService,
    private router: Router
  ) {
    this.isAddForm = this.router.url.includes("add");
    this.clientService.getClients().subscribe((clients: any[]) => {
      // console.log(clients);
      this.clients = clients;
    });

    // this.companyService.getActiveCompanyDetail().subscribe((company: any) => {
    //   // console.log(company);
    //   this.company = company;
    // });

    this.productService.getProducts().subscribe((products: any[]) => {
      this.products = products;
    });

    this.quotationService.getQuotationTypes().subscribe((types: any[]) => {
      this.types = types;
    });
  }

  ngOnInit() {
    // console.log(this.client);
    // this.isClientInformation = true;
    // console.log(this.client);
  }

  ngAfterContentInit(): void {
    if (this.isAddForm) {
      this.quotation.currency = this.current_currency;
      this.companyService.getActiveCompanyDetail().subscribe((company: any) => {
        // console.log(company);
        this.company = company;
        this.quotation.company_id = this.company.id;
      });

      // this.quotationService
      //   .generateNextReference()
      //   .subscribe((reference: any) => {
      //     this.quotation.reference = reference.next_reference;
      //   });
    } else {
      this.quotation.currency = this.currencies.find(
        (el: any) => el.id == this.quotation.currency_used
      );
      if (this.quotation.type.type == "Products") {
        this.order_products_list = this.quotation.products;
      } else {
        this.order_services_list = this.quotation.services;
      }

      this.isShipping = this.quotation.delivery_status;
      this.isVAT = this.quotation.tva_status;
      this.isDiscount = this.quotation.discount_status;
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

  selectedType() {
    this.order_products_list = [];
    this.order_services_list = [];
    this.totalAmount = 0;
    this.quotation_product = {
      product: null,
      unit_price: 0,
      market_price: 0,
      quantity: 0,
    };

    this.quotation_service = {
      service: "",
      unit_price: 0,
      quantity: 0,
    };
  }

  disabledAssignButton() {
    return (
      this.quotation_product.product == null ||
      this.quotation_product.unit_price == 0 ||
      this.quotation_product.quantity == 0
    );
  }

  disabledAssignServiceButton() {
    return (
      this.quotation_service.service == "" ||
      this.quotation_service.unit_price == 0 ||
      this.quotation_service.quantity == 0
    );
  }

  assignProduct() {
    if (this.isAddForm) {
      this.order_products_list.push(this.quotation_product);
      this.totalAmount +=
        this.quotation_product.quantity * this.quotation_product.unit_price;
      this.quotation_product = {
        product: null,
        unit_price: 0,
        market_price: 0,
        quantity: 0,
      };
    } else {
      const new_product_order = this.removed_order_products_list.find(
        (itemA) => this.quotation_product.product.id === itemA.product.id
      );

      // console.log(new_product_order);

      if (new_product_order) {
        this.removed_order_products_list =
          this.removed_order_products_list.filter(
            (itemA) => this.quotation_product.product.id !== itemA.product.id
          );
        new_product_order.quantity = this.quotation_product.quantity;
        new_product_order.unit_price = this.quotation_product.unit_price;
        this.order_products_list.push(new_product_order);
      } else {
        this.order_products_list.push(this.quotation_product);
      }
      this.quotation_product = {
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
        this.quotation_product.quantity * this.quotation_product.unit_price;
      this.order_products_list = this.order_products_list.filter(
        (itemA) => order_product.product.id !== itemA.product.id
      );
      this.quotation_product = {
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
      this.quotation_product = {
        product: null,
        unit_price: 0,
        quantity: 0,
      };
    }
  }

  assignService() {
    if (this.isAddForm) {
      this.order_services_list.push(this.quotation_service);
      this.totalAmount +=
        this.quotation_service.quantity * this.quotation_service.unit_price;
      this.quotation_service = {
        service: null,
        unit_price: 0,
        quantity: 0,
      };
    } else {
      const new_service_order = this.removed_order_services_list.find(
        (itemA) => this.quotation_service.service === itemA.service
      );

      // console.log(new_product_order);

      if (new_service_order) {
        this.removed_order_services_list =
          this.removed_order_services_list.filter(
            (itemA) => this.quotation_service.service !== itemA.service
          );
        new_service_order.quantity = this.quotation_service.quantity;
        new_service_order.unit_price = this.quotation_service.unit_price;
        this.order_services_list.push(new_service_order);
      } else {
        this.order_services_list.push(this.quotation_service);
      }
      this.quotation_service = {
        product: null,
        unit_price: 0,
        quantity: 0,
      };
    }
  }

  removeServiceToList(order_service: any) {
    if (this.isAddForm) {
      this.totalAmount -=
        this.quotation_service.quantity * this.quotation_service.unit_price;
      this.order_services_list = this.order_services_list.filter(
        (itemA) => order_service.service !== itemA.service
      );
      this.quotation_service = {
        service: null,
        unit_price: 0,
        quantity: 0,
      };
    } else {
      this.removed_order_services_list.push(order_service);
      this.order_services_list = this.order_services_list.filter(
        (itemA) => order_service.service !== itemA.service
      );
      // console.log(this.order_services_list);
      this.quotation_service = {
        service: null,
        unit_price: 0,
        quantity: 0,
      };
    }
  }

  stateCheckedBoxCustom(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.isShipping = true;
    } else {
      this.isShipping = false;
    }
  }

  stateCheckedBoxDiscount(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.isDiscount = true;
    } else {
      this.isDiscount = false;
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

  print(po: any) {
    this.router.navigate(["/quotations/print", po.id]);
  }

  // onSubmit() {}

  onSubmit() {
    this.quotation.amount = this.totalAmount;
    this.quotation.client_id = this.quotation.client.id;
    this.quotation.type_id = this.quotation.type.id;
    this.quotation.currency_used = this.quotation.currency.id;
    this.quotation.locale_currency = this.quotation.currency.locale;
    delete this.quotation.currency;
    delete this.quotation.client;
    delete this.quotation.type;

    if (this.isShipping) {
      this.quotation.delivery_status = this.isShipping;
      this.quotation.shipping_amount = this.quotation.delivery_amount;
    } else {
      this.quotation.delivery_status = this.isShipping;
      this.quotation.delivery_amount = 0;
    }
    if (this.isVAT) {
      this.quotation.tva_status = this.isVAT;
    } else {
      this.quotation.tva_status = this.isVAT;
    }

    if (this.isDiscount) {
      this.quotation.discount_status = this.isDiscount;
    } else {
      this.quotation.discount_status = this.isDiscount;
      this.quotation.discount_percent = 0;
    }
    // console.log(this.quotation);
    // console.log(this.order_products_list);
    if (this.isAddForm) {
      this.quotationService.saveQuotation(this.quotation).subscribe({
        next: (data) => {
          // console.log(data.body.id);
          let quotation_id = data.body.id;
          if (data.status == 201) {
            // Handle the response from the server
            if (this.quotation.type_id == 2) {
              for (let item of this.order_products_list) {
                const quotation_product = {
                  product_id: item.product.id,
                  quotation_id: data.body.id,
                  unit_price: item.unit_price,
                  market_price: item.market_price,
                  quantity: item.quantity,
                  status: true,
                };
                this.quotationService
                  .saveQuotationProduct(quotation_product)
                  .subscribe({
                    next: (data) => {},
                    error: (err) => console.error(err),
                  });
              }
            } else {
              for (let item of this.order_services_list) {
                const quotation_service = {
                  service: item.service,
                  quotation_id: quotation_id,
                  unit_price: item.unit_price,
                  quantity: item.quantity,
                  status: true,
                };
                this.quotationService
                  .saveQuotationService(quotation_service)
                  .subscribe({
                    next: (data) => {},
                    error: (err) => console.error(err),
                  });
              }
            }

            this.isGeneratingPDF = true;

            setTimeout(() => {
              this.quotationService.getQuotation(+quotation_id).subscribe({
                next: (response) => {
                  // console.log(response);
                  if (response.status == 200) {
                    M.toast({
                      html: "Data created successfully....",
                      classes: "rounded green accent-4",
                      inDuration: 500,
                      outDuration: 575,
                    });
                    // this.loadItems();
                    this.isGeneratingPDF = false;
                    this.print(response.body);
                  }
                },
                error: (err) => console.error(err),
              });
            }, 500);

            // this.router.navigate(["/quotations/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    } else {
      if (this.quotation.type_id == 2) {
        for (let item of this.order_products_list) {
          this.totalAmount += item.quantity * item.unit_price;
        }
      } else {
        for (let item of this.order_services_list) {
          this.totalAmount += item.quantity * item.unit_price;
        }
      }

      this.quotation.amount = this.totalAmount;
      this.quotationService.updateQuotation(this.quotation).subscribe({
        next: (data) => {
          // console.log(data);
          if (data.status == 206) {
            // Handle the response from the server
            if (this.quotation.type_id == 2) {
              for (let item of this.order_products_list) {
                if (item.id) {
                  const quotation_product = {
                    id: item.id,
                    unit_price: item.unit_price,
                    market_price: item.market_price,
                    quantity: item.quantity,
                    status: true,
                  };
                  this.quotationService
                    .updateQuotationProduct(quotation_product)
                    .subscribe({
                      next: (data) => {},
                      error: (err) => console.error(err),
                    });
                } else {
                  const quotation_product = {
                    product_id: item.product.id,
                    quotation_id: data.body.id,
                    unit_price: item.unit_price,
                    market_price: item.market_price,
                    quantity: item.quantity,
                    status: true,
                  };
                  this.quotationService
                    .saveQuotationProduct(quotation_product)
                    .subscribe({
                      next: (data) => {},
                      error: (err) => console.error(err),
                    });
                }
              }

              if (this.removed_order_products_list.length != 0) {
                for (let item of this.removed_order_products_list) {
                  const quotation_product = {
                    id: item.id,
                    unit_price: item.unit_price,
                    quantity: item.quantity,
                    status: true,
                  };
                  this.quotationService
                    .deleteQuotationProduct(quotation_product)
                    .subscribe({
                      next: (data) => {},
                      error: (err) => console.error(err),
                    });
                }
              }
            } else {
              for (let item of this.order_services_list) {
                if (item.id) {
                  const quotation_service = {
                    id: item.id,
                    unit_price: item.unit_price,
                    quantity: item.quantity,
                    status: true,
                  };
                  this.quotationService
                    .updateQuotationService(quotation_service)
                    .subscribe({
                      next: (data) => {},
                      error: (err) => console.error(err),
                    });
                } else {
                  const quotation_service = {
                    service: item.service,
                    quotation_id: data.body.id,
                    unit_price: item.unit_price,
                    quantity: item.quantity,
                    status: true,
                  };
                  this.quotationService
                    .saveQuotationService(quotation_service)
                    .subscribe({
                      next: (data) => {},
                      error: (err) => console.error(err),
                    });
                }
              }

              if (this.removed_order_services_list.length != 0) {
                for (let item of this.removed_order_services_list) {
                  const quotation_service = {
                    id: item.id,
                    unit_price: item.unit_price,
                    quantity: item.quantity,
                    status: true,
                  };
                  this.quotationService
                    .deleteQuotationService(quotation_service)
                    .subscribe({
                      next: (data) => {},
                      error: (err) => console.error(err),
                    });
                }
              }
            }
            this.isGeneratingPDF = true;

            setTimeout(() => {
              this.quotationService.getQuotation(data.body.id).subscribe({
                next: (data) => {
                  M.toast({
                    html: "Data updated successfully....",
                    classes: "rounded green accent-4",
                    inDuration: 500,
                    outDuration: 575,
                  });
                  // this.loadItems();
                  this.isGeneratingPDF = false;
                  this.print(data.body);
                  // this.router.navigate(["/purchase-orders/list"]);
                },
                error: (err) => console.error(err),
              });
            }, 500);

            // this.router.navigate(["/quotations/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    }
  }
}
