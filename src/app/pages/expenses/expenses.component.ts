import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CustomCurrencyPipe } from "../../pipes/currency.pipe";
import { BaseComponent } from "../base/base.component";
import { Router } from "@angular/router";
import { CompanyDetailService } from "../../services/company-detail.service";
import { ExpenseService } from "../../services/expense.service";

@Component({
  selector: "app-expenses",
  standalone: true,
  imports: [CommonModule, BaseComponent, CustomCurrencyPipe, FormsModule],
  templateUrl: "./expenses.component.html",
  styleUrl: "./expenses.component.css",
})
export class ExpensesComponent {
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

  currentPage = 1;
  rowsPerPage = 5;

  data: any[] = [];

  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private companyService: CompanyDetailService
  ) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData();
  }

  loadData() {
    this.expenseService.getExpenses().subscribe({
      next: (data) => {
        // console.log(data);
        this.data = data;
      },
      error: (err) => console.error(err),
    });
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.data.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.data.length / this.rowsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  edit(item: any) {
    this.router.navigate(["/expenses/edit", item.id]);
  }
  print(report: any) {
    this.router.navigate(["/expenses/print", report.id]);
  }
  delete(item: any) {}
}
