import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ToolsService } from "../../../../services/tools.service";
import { CashManagementService } from "../../../../services/cash-management.service";
declare var M: any;

@Component({
  selector: "app-form-transaction",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-transaction.component.html",
  styleUrl: "./form-transaction.component.css",
})
export class FormTransactionComponent {
  @Input() transaction: any;
  isAddForm: boolean;
  types: any[] = [
    { id: "in", value: "Credit" },
    { id: "out", value: "Debit" },
  ];

  constructor(
    private cashService: CashManagementService,
    private router: Router
  ) {
    this.isAddForm = this.router.url.includes("add");
  }

  ngOnInit() {
    // console.log(this.client);
    // this.isClientInformation = true;
    // console.log(this.client);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onSubmit() {
    // console.log(this.client);
    if (this.isAddForm) {
      this.cashService.saveTransaction(this.transaction).subscribe({
        next: (data) => {
          // console.log(data.status);
          if (data.status == 201) {
            // Handle the response from the server
            M.toast({
              html: "Data created successfully....",
              classes: "rounded green accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            // this.loadItems();
            this.router.navigate(["/transactions/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    } else {
      this.cashService.updateTransaction(this.transaction).subscribe({
        next: (data) => {
          // console.log(data);
          if (data.status == 206) {
            // Handle the response from the server
            M.toast({
              html: "Data updated successfully....",
              classes: "rounded green accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            // this.loadItems();
            this.router.navigate(["/transactions/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    }
  }
}
