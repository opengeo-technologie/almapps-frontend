import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormPaymentComponent } from "../form-payment/form-payment.component";

@Component({
  selector: "app-add-payment",
  imports: [FormPaymentComponent, BaseComponent, FormsModule, CommonModule],
  standalone: true,
  templateUrl: "./add-payment.component.html",
  styleUrl: "./add-payment.component.css",
})
export class AddPaymentComponent {
  payment: any = {
    reference: "",
    invoice_id: null,
    type: null,
    currency: null,
    user_id: 1,
    company_id: 1,
    date_op: null,
    amount: 0,
    currency_used: "",
    locale_currency: "",
  };

  submenus: any[] = [
    {
      url: "/payments/list",
      name: "Payments",
      icon: "013-payment-method.svg",
    },
  ];

  ngOnInit(): void {}
}
