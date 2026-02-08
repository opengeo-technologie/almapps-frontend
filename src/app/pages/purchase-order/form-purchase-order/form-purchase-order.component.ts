import { HttpEventType } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { ClientService } from "../../../services/client.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { PurchaseOrderService } from "../../../services/purchase-order.service";
import { ProductService } from "../../../services/product.service";
import { CompanyDetailService } from "../../../services/company-detail.service";
declare var M: any;

@Component({
  selector: "app-form-purchase-order",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-purchase-order.component.html",
  styleUrl: "./form-purchase-order.component.css",
})
export class FormPurchaseOrderComponent {
  @Input() po: any;
  isAddForm: boolean;
  isGeneratingPDF: boolean = false;
  vendors: any[] = [];
  products: any[] = [];
  // clientForm: NgForm;
  order_product: any = {
    product: null,
    unit_price: 0,
    quantity: 0,
  };

  shipping_details: any = {
    shipping_terms: "",
    shipping_method: "",
    shipping_date: "2025-08-27",
    shipping_amount: 0,
  };

  discount_percent: number = 0;

  order_products_list: any[] = [];
  removed_order_products_list: any[] = [];
  selectedTypeId: number = 0;
  response: boolean = false;
  isShipping: boolean = false;
  isVAT: boolean = false;
  isDiscount: boolean = false;

  totalAmount: any = 0;

  company: any = {};

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
    private companyService: CompanyDetailService,
    private router: Router
  ) {
    this.isAddForm = this.router.url.includes("add");

    this.productService.getVendors().subscribe((vendors: any[]) => {
      this.vendors = vendors;
    });

    this.productService.getProducts().subscribe((products: any[]) => {
      this.products = products;
    });
  }

  ngOnInit() {
    // console.log(this.client);
    // this.isClientInformation = true;
    // console.log(this.client);
  }

  ngAfterContentInit(): void {
    if (this.isAddForm) {
      this.po.currency = this.current_currency;
      // this.poService.generateNextReference().subscribe((reference: any) => {
      //   this.po.reference = reference.next_reference;
      // });
      this.companyService.getActiveCompanyDetail().subscribe((company: any) => {
        // console.log(company);
        this.company = company;
        this.po.company_id = this.company.id;
      });
    } else {
      // console.log(this.po);
      this.po.currency = this.currencies.find(
        (el: any) => el.id == this.po.currency_used
      );
      this.order_products_list = this.po.products;
      this.isShipping = this.po.shipping_status;
      this.isVAT = this.po.tva_status;
      this.isDiscount = this.po.discount_status;
      this.shipping_details.shipping_terms = this.po.shipping_terms;
      this.shipping_details.shipping_method = this.po.shipping_method;
      this.shipping_details.shipping_date = this.po.shipping_date;
      this.shipping_details.shipping_amount = this.po.shipping_amount;
      // console.log(this.po);
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id && c1.type === c2.type : c1 === c2;
  }

  get filteredProducts() {
    let data = [...this.products];
    return data.filter(
      (itemA) =>
        !this.order_products_list.some((itemB) => itemB.product.id === itemA.id)
    );
  }

  disabledAssignButton() {
    return (
      this.order_product.product == null ||
      this.order_product.unit_price == 0 ||
      this.order_product.quantity == 0
    );
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
      console.log(this.order_products_list);
      this.order_product = {
        product: null,
        unit_price: 0,
        quantity: 0,
      };
    }
  }

  stateCheckedBoxShipping(event: Event) {
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
    this.router.navigate(["/purchase-order/print", po.id]);
  }

  onSubmit() {
    this.po.amount = this.totalAmount;
    this.po.vendor_id = this.po.vendor.id;
    this.po.currency_used = this.po.currency.id;
    this.po.locale_currency = this.po.currency.locale;
    delete this.po.currency;
    delete this.po.vendor;

    if (this.isShipping) {
      this.po.shipping_status = this.isShipping;
      // this.po.amount += this.shipping_details.shipping_amount;
      this.po.shipping_terms = this.shipping_details.shipping_terms;
      this.po.shipping_method = this.shipping_details.shipping_method;
      this.po.shipping_date = this.shipping_details.shipping_date;
      this.po.shipping_amount = this.shipping_details.shipping_amount;
    } else {
      this.po.shipping_status = this.isShipping;
      // this.po.amount += this.shipping_details.shipping_amount;
      this.po.shipping_terms = "";
      this.po.shipping_method = "";
      this.po.shipping_date = null;
      this.po.shipping_amount = 0;
    }
    if (this.isVAT) {
      this.po.tva_status = this.isVAT;
    } else {
      this.po.tva_status = this.isVAT;
    }

    if (this.isDiscount) {
      this.po.discount_status = this.isDiscount;
    } else {
      this.po.discount_status = this.isDiscount;
      this.po.discount_percent = 0;
    }
    // console.log(this.po);
    if (this.isAddForm) {
      this.poService.savePurchaseOrder(this.po).subscribe({
        next: (data) => {
          // console.log(data.body.id);
          let po_id = data.body.id;
          if (data.status == 201) {
            // Handle the response from the server
            for (let item of this.order_products_list) {
              const po_product = {
                product_id: item.product.id,
                po_id: data.body.id,
                unit_price: item.unit_price,
                quantity: item.quantity,
              };
              this.poService.savePurchaseOrderProduct(po_product).subscribe({
                next: (data) => {},
                error: (err) => console.error(err),
              });
            }
            this.isGeneratingPDF = true;
            setTimeout(() => {
              this.poService.getPurchaseOrder(+po_id).subscribe({
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

            // this.router.navigate(["/purchase-orders/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    } else {
      for (let item of this.order_products_list) {
        this.totalAmount += item.quantity * item.unit_price;
      }
      this.po.amount = this.totalAmount;
      this.poService.updatePurchaseOrder(this.po).subscribe({
        next: (data) => {
          // console.log(data);
          if (data.status == 206) {
            // Handle the response from the server
            for (let item of this.order_products_list) {
              if (item.id) {
                const po_product = {
                  id: item.id,
                  unit_price: item.unit_price,
                  quantity: item.quantity,
                  status: true,
                };
                this.poService
                  .updatePurchaseOrderProduct(po_product)
                  .subscribe({
                    next: (data) => {},
                    error: (err) => console.error(err),
                  });
              } else {
                const po_product = {
                  product_id: item.product.id,
                  po_id: data.body.id,
                  unit_price: item.unit_price,
                  quantity: item.quantity,
                };
                this.poService.savePurchaseOrderProduct(po_product).subscribe({
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
                this.poService
                  .deletePurchaseOrderProduct(po_product)
                  .subscribe({
                    next: (data) => {},
                    error: (err) => console.error(err),
                  });
              }
            }

            this.isGeneratingPDF = true;
            setTimeout(() => {
              this.poService.getPurchaseOrder(data.body.id).subscribe({
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
          }
        },
        error: (err) => console.error(err),
      });
    }
  }
}
