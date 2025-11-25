import { Component } from "@angular/core";
import { BaseComponent } from "../../../base/base.component";
import { FormTransactionComponent } from "../form-transaction/form-transaction.component";
import { AuthService } from "../../../../services/auth.service";
import { CashManagementService } from "../../../../services/cash-management.service";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-edit-transaction",
  imports: [BaseComponent, FormTransactionComponent, FormsModule, CommonModule],
  standalone: true,
  templateUrl: "./edit-transaction.component.html",
  styleUrl: "./edit-transaction.component.css",
})
export class EditTransactionComponent {
  transaction: any | undefined;
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

  // constructor(
  //   private authService: AuthService,
  //   private cashService: CashManagementService
  // ) {
  //   const userData = this.authService.getUser();
  //   if (userData) {
  //     // console.log(JSON.parse(userData));
  //     this.transaction.user_id = JSON.parse(userData).id;
  //   }
  //   this.transaction.date = this.today;
  //   this.cashService.getOpenedCashRegister().subscribe({
  //     next: (data) => {
  //       this.transaction.cash_id = data.id;
  //     },
  //     error: (err) => console.error(err),
  //   });
  // }

  constructor(
    private route: ActivatedRoute,
    private cashService: CashManagementService
  ) {}

  ngOnInit() {
    const transactionId: string | null = this.route.snapshot.paramMap.get("id");
    if (transactionId) {
      // console.log(clientId);
      this.cashService.getTransaction(+transactionId).subscribe((item) => {
        console.log(item);
        this.transaction = item;
      });
    } else {
      this.transaction = undefined;
    }
  }
}
