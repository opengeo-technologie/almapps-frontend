import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ClientService } from "../../../services/client.service";
import { CompanyDetailService } from "../../../services/company-detail.service";
import { InvoiceService } from "../../../services/invoice.service";
import { JobsService } from "../../../services/jobs.service";
import { ProductService } from "../../../services/product.service";
import { PurchaseOrderService } from "../../../services/purchase-order.service";
import { TechnicianService } from "../../../services/technician.service";
import { Router } from "@angular/router";
import { ExpenseService } from "../../../services/expense.service";
import { CustomCurrencyPipe } from "../../../pipes/currency.pipe";
import { AuthService } from "../../../services/auth.service";
import { timeout } from "rxjs";
declare var M: any;

@Component({
  selector: "app-form-expense",
  imports: [CommonModule, FormsModule, CustomCurrencyPipe],
  standalone: true,
  templateUrl: "./form-expense.component.html",
  styleUrl: "./form-expense.component.css",
})
export class FormExpenseComponent {
  @Input() expense: any;
  @ViewChild("selectInvoice") selectInvoice!: ElementRef;
  @ViewChild("selectTechnician") selectTechnician!: ElementRef;
  @ViewChild("selectTechnician2") selectTechnician2!: ElementRef;
  @ViewChild("selectJob") selectJob!: ElementRef;
  @ViewChild("selectJobAssign") selectJobAssign!: ElementRef;
  isAddForm: boolean;
  invoices: any[] = [];
  technicians: any[] = [];
  assigned_jobs: any[] = [];
  jobs: any[] = [];
  types: any[] = [];
  user: any;

  products: any[] = [];
  // clientForm: NgForm;
  order_product: any = {
    product: null,
    unit_price: 0,
    quantity: 0,
  };

  expense_task: any = {
    technician: null,
    job: null,
    expense_id: null,
    technician_id: null,
    job_id: null,
    job_assign: null,
    task: "",
    amount: 0,
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

  item_list: any[] = [];
  removed_from_items_list: any[] = [];
  selectedTypeId: number = 0;

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

  types_expenses: any[] = [
    {
      id: "none",
      value: "Without invoice",
    },
    {
      id: "invoice",
      value: "Link invoice",
    },
    {
      id: "job_assign",
      value: "On Job Assign",
    },
  ];

  constructor(
    private poService: PurchaseOrderService,
    private productService: ProductService,
    private companyService: CompanyDetailService,
    private invoiceService: InvoiceService,
    private jobService: JobsService,
    private authService: AuthService,
    private expenseService: ExpenseService,
    private router: Router
  ) {
    this.isAddForm = this.router.url.includes("add");
    this.invoiceService.getInvoices().subscribe((invoices: any[]) => {
      // console.log(invoices);
      this.invoices = invoices;
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

    // this.techService.getTechnicians().subscribe((technicians: any[]) => {
    //   this.technicians = technicians;
    // });
  }

  ngOnInit() {
    // console.log(this.client);
    // this.isClientInformation = true;
    // console.log(this.client);
  }

  ngAfterContentInit(): void {
    // M.FormSelect.init(this.selectInvoice.nativeElement);
    if (this.isAddForm) {
      this.expense.currency = this.current_currency;
      this.companyService.getActiveCompanyDetail().subscribe((company: any) => {
        // console.log(company);
        this.company = company;
        this.expense.company_id = this.company.id;
      });

      this.invoiceService
        .generateNextReference()
        .subscribe((reference: any) => {
          this.expense.reference = reference.next_reference;
        });

      const userData = this.authService.getUser();
      if (userData) {
        // console.log(JSON.parse(userData));
        this.user = JSON.parse(userData);
        this.expense.user_id = this.user.id;
      }
    } else {
      // console.log(this.expense);
      this.expense.currency = this.current_currency;
      this.expense.type_expense = this.types_expenses.find(
        (el: any) => el.id == this.expense.type_expense
      );
      this.item_list = this.expense.tasks;
      if (this.expense.invoice != null) {
        this.invoiceDropdown();
        this.invoiceSelected();
      }

      if (this.expense.tasks[0].job_assign != null) {
        // console.log(this.expense.tasks[0].job_assign);
        this.expense_task.job_assign = this.expense.tasks[0].job_assign;
        this.assignedJobsSelectList();
      }
    }
  }

  assignedJobsSelectList() {
    if (this.isAddForm) {
      this.jobService
        .getJobsAssignedByStatus(false)
        .subscribe((assigned_jobs: any[]) => {
          this.assigned_jobs = assigned_jobs;
          setTimeout(() => {
            const instance = M.FormSelect.init(
              this.selectJobAssign.nativeElement
            );
            this.addSearchBox(this.selectJobAssign.nativeElement);
          }, 300);
        });
    } else {
      this.jobService.getJobsAssigned().subscribe((assigned_jobs: any[]) => {
        this.assigned_jobs = assigned_jobs;
        setTimeout(() => {
          const instance = M.FormSelect.init(
            this.selectJobAssign.nativeElement
          );
          this.addSearchBox(this.selectJobAssign.nativeElement);
        }, 300);
      });
    }
  }

  assignedInvoiceSelectList() {
    this.invoiceService.getInvoices().subscribe((invoices: any[]) => {
      console.log(invoices);
      this.invoices = invoices;
      // Wait a moment for Angular to render <option>s, then init Materialize select

      setTimeout(() => {
        const instance = M.FormSelect.init(this.selectInvoice.nativeElement);
        this.addSearchBox(this.selectInvoice.nativeElement);
      }, 300);
    });
  }

  invoiceDropdown() {
    if (this.isAddForm) {
      this.jobs = [];
      this.technicians = [];
      this.expense.invoice = null;
      this.expense_task.technician = null;
      this.expense_task.job = null;
      this.item_list = [];
    }

    if (this.expense.type_expense.id == "invoice") {
      this.assignedInvoiceSelectList();
    } else if (this.expense.type_expense.id == "job_assign") {
      this.assignedJobsSelectList();
    }
  }

  addSearchBox(element: any) {
    const dropdownContent = document.querySelector(
      ".select-dropdown.dropdown-content"
    ) as HTMLElement;
    if (!dropdownContent) return;

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search...";
    searchInput.classList.add("browser-default", "search-input");
    searchInput.style.margin = "8px";
    searchInput.style.width = "90%";

    //// --- Prevent dropdown from closing ---
    // Handle both mousedown and click (Materialize listens to both)
    ["mousedown", "click"].forEach((evt) => {
      searchInput.addEventListener(evt, (event) => {
        event.stopPropagation();
        event.preventDefault();
      });
    });

    dropdownContent.insertBefore(searchInput, dropdownContent.firstChild);

    // Filter options
    searchInput.addEventListener("keyup", () => {
      const filter = searchInput.value.toLowerCase();
      const items = dropdownContent.querySelectorAll("li > span");
      items.forEach((item: any) => {
        const text = item.textContent.toLowerCase();
        (item.parentElement as HTMLElement).style.display = text.includes(
          filter
        )
          ? ""
          : "none";
      });
    });
    // --- Focus automatically when dropdown opens ---
    const selectInput = element;
    const instance = M.FormSelect.getInstance(selectInput);

    if (instance && instance.dropdown) {
      instance.dropdown.options.onOpenStart = () => {
        setTimeout(() => searchInput.focus(), 200);
      };
    }
  }

  invoiceSelected() {
    if (this.isAddForm) {
      this.jobs = [];
      this.technicians = [];
      this.expense_task.technician = null;
      this.expense_task.job = null;
    }

    // this.item_list = [];
    if (this.expense.invoice && this.expense.invoice.technicians.length != 0) {
      this.technicians = this.expense.invoice.technicians;

      setTimeout(() => {
        M.FormSelect.init(this.selectTechnician2.nativeElement);
      }, 300);
    } else if (this.expense.invoice && this.expense.invoice.jobs.length != 0) {
      this.jobs = this.expense.invoice.jobs;
      this.jobs = this.jobs.filter((el: any) => el.status == false);

      setTimeout(() => {
        M.FormSelect.init(this.selectJob.nativeElement);
      }, 300);
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareClient(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  disabledAssignExpenseTaskButton() {
    return this.expense_task.task == null || this.expense_task.amount == 0;
  }

  initExpensceTaskValues() {
    this.expense_task = {
      technician: null,
      job: null,
      expense_id: null,
      technician_id: null,
      job_id: null,
      job_assign: null,
      task: "",
      amount: 0,
    };
  }

  assignTask() {
    // console.log(this.expense_task);
    if (this.isAddForm) {
      this.item_list.push(this.expense_task);
      // this.totalAmount += this.job.duration * this.job.price;
      if (this.expense.type_expense.id == "job_assign") {
        const job_assign = this.expense_task.job_assign;
        this.initExpensceTaskValues();
        this.invoiceSelected();
        this.expense_task.job_assign = job_assign;
        this.assignedJobsSelectList();
      } else {
        this.initExpensceTaskValues();
        this.invoiceSelected();
      }
    } else {
      const new_item = this.removed_from_items_list.find(
        (itemA) => this.expense_task.id === itemA.task.id
      );
      if (new_item) {
        this.removed_from_items_list = this.removed_from_items_list.filter(
          (itemA) => this.expense_task.id !== itemA.id
        );
        new_item.amount = this.expense_task.amount;
        new_item.label = this.expense_task.label;
        this.item_list.push(new_item);
      } else {
        this.item_list.push(this.expense_task);
      }
      this.initExpensceTaskValues();
      this.invoiceSelected();
    }
  }

  removeItemToList(item: any, index: number) {
    if (this.isAddForm) {
      // console.log(this.item_list);
      this.item_list.splice(index, 1);
      this.initExpensceTaskValues();
      this.invoiceSelected();
    } else {
      this.removed_from_items_list.push(item);
      this.item_list.splice(index, 1);
      // console.log(this.removed_from_items_list);
      this.initExpensceTaskValues();
      this.invoiceSelected();
    }
  }

  print(expense_id: number) {
    this.router.navigate(["/expenses/print", expense_id]);
  }

  calculateTotalExpense(): number {
    let result = 0;
    for (let task of this.item_list) {
      result += task.amount;
    }
    return result;
  }

  saveExpenseTasks(item: any, expense_id: number) {
    let data = {
      amount: item.amount,
      task: item.task,
      expense_id: expense_id,
      technician_id: null,
      job_id: null,
      job_assign_id: null,
    };

    if (item.technician != null) {
      data.technician_id = item.technician.id;
    } else if (item.job != null) {
      data.job_id = item.job.id;
    } else if (item.job_assign != null) {
      data.job_assign_id = item.job_assign.id;
    }

    this.expenseService.saveExpenseTask(data).subscribe({
      next: (response: any) => {},
      error: (err: any) => console.error(err),
    });
  }

  deleteRemoveTasks() {
    for (let item of this.removed_from_items_list) {
      this.expenseService.deleteExpenseTask(item).subscribe({
        next: (response: any) => {},
        error: (err: any) => console.error(err),
      });
    }
  }

  onSubmit() {
    if (this.isAddForm) {
      // console.log(this.expense);
      this.expense.type_expense = this.expense.type_expense.id;
      if (this.expense.type_expense == "invoice") {
        this.expense.invoice_id = this.expense.invoice.id;
      }
      this.expense.amount = this.calculateTotalExpense();
      this.expenseService.saveExpense(this.expense).subscribe({
        next: (data: any) => {
          // console.log(data.body);
          let expense_id = data.body.id;
          if (data.status == 201) {
            for (let task of this.item_list) {
              this.saveExpenseTasks(task, expense_id);
            }

            M.toast({
              html: "Data created successfully....",
              classes: "rounded green accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            // this.router.navigate(["/expenses/list"]);
            setTimeout(() => {
              this.print(expense_id);
            }, 500);
          }
        },
        error: (err: any) => console.error(err),
      });
    } else {
      this.expense.type_expense = this.expense.type_expense.id;
      if (this.expense.type_expense == "invoice") {
        this.expense.invoice_id = this.expense.invoice.id;
      }
      this.expense.amount = this.calculateTotalExpense();
      // console.log(this.expense);

      delete this.expense.currency;
      delete this.expense.tasks;
      delete this.expense.user;
      // console.log(this.expense);
      this.expenseService.updateExpense(this.expense).subscribe({
        next: (data: any) => {
          // console.log(data.body);
          let expense_id = data.body.id;
          if (data.status == 206) {
            if (this.removed_from_items_list.length != 0) {
              this.deleteRemoveTasks();
            }
            for (let task of this.item_list) {
              if (!task.hasOwnProperty("id")) {
                this.saveExpenseTasks(task, expense_id);
              }
            }

            M.toast({
              html: "Data updated successfully....",
              classes: "rounded green accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            // this.router.navigate(["/expenses/list"]);
            setTimeout(() => {
              this.print(expense_id);
            }, 500);
          }
        },
        error: (err: any) => console.error(err),
      });
    }
  }
}
