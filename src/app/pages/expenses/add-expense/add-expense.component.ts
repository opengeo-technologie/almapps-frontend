import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { FormInvoiceComponent } from "../../invoices/form-invoice/form-invoice.component";
import { FormExpenseComponent } from "../form-expense/form-expense.component";

@Component({
  selector: "app-add-expense",
  imports: [FormExpenseComponent, BaseComponent, FormsModule, CommonModule],
  standalone: true,
  templateUrl: "./add-expense.component.html",
  styleUrl: "./add-expense.component.css",
})
export class AddExpenseComponent {
  expense: any = {
    reference: "EXP0002",
    label: "",
    amount: 1000,
    type_expense: null,
    invoice_id: null,
    // currency: null,
    user_id: 1,
    // company_id: 1,
    date: null,
    // currency_used: "",
    // locale_currency: "",
    // heading: "",
  };

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

  ngOnInit(): void {}
}
