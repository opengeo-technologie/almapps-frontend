import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ExpenseService } from "../../../services/expense.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BaseComponent } from "../../base/base.component";
import { FormExpenseComponent } from "../form-expense/form-expense.component";

@Component({
  selector: "app-edit-expense",
  imports: [FormExpenseComponent, BaseComponent, FormsModule, CommonModule],
  standalone: true,
  templateUrl: "./edit-expense.component.html",
  styleUrl: "./edit-expense.component.css",
})
export class EditExpenseComponent {
  expense: any | undefined;

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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ExpenseService
  ) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    const expense_id: string | null = this.route.snapshot.paramMap.get("id");
    if (expense_id) {
      // console.log(clientId);
      this.apiService.getExpense(+expense_id).subscribe((invoice) => {
        // console.log(invoice);
        this.expense = invoice;
      });
    } else {
      this.expense = undefined;
    }
  }
}
