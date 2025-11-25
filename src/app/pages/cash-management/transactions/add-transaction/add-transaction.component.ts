import { Component } from "@angular/core";
import { BaseComponent } from "../../../base/base.component";
import { FormTransactionComponent } from "../form-transaction/form-transaction.component";
import { AuthService } from "../../../../services/auth.service";
import { CashManagementService } from "../../../../services/cash-management.service";

@Component({
  selector: "app-add-transaction",
  imports: [BaseComponent, FormTransactionComponent],
  standalone: true,
  templateUrl: "./add-transaction.component.html",
  styleUrl: "./add-transaction.component.css",
})
export class AddTransactionComponent {
  transaction: any = {
    description: "",
    date: "",
    amount: 0.0,
    cash_id: null,
    user_id: null,
    type: null,
  };
  today: string = new Date().toISOString().split("T")[0];

  submenus: any[] = [
    {
      url: "/cash-management/list",
      name: "Cash register",
      icon: "cashier.svg",
    },
    {
      url: "/transactions/list",
      name: "Transactions",
      icon: "transaction.svg",
    },
  ];

  constructor(
    private authService: AuthService,
    private cashService: CashManagementService
  ) {
    const userData = this.authService.getUser();
    if (userData) {
      // console.log(JSON.parse(userData));
      this.transaction.user_id = JSON.parse(userData).id;
    }
    this.transaction.date = this.today;
    this.cashService.getOpenedCashRegister().subscribe({
      next: (data) => {
        this.transaction.cash_id = data.id;
      },
      error: (err) => console.error(err),
    });
  }
}
