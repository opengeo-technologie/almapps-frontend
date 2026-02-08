import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { MenuListComponent } from "./pages/menu-list/menu-list.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { ClientComponent } from "./pages/client/client.component";
import { ClientTypeComponent } from "./pages/client-type/client-type.component";
import { AddClientComponent } from "./pages/client/add-client/add-client.component";
import { EditClientComponent } from "./pages/client/edit-client/edit-client.component";
import { DetailClientComponent } from "./pages/client/detail/detail.component";
import { ProductsComponent } from "./pages/products/products.component";
import { VendorsComponent } from "./pages/vendors/vendors.component";
import { AddVendorComponent } from "./pages/vendors/add-vendor/add-vendor.component";
import { EditVendorComponent } from "./pages/vendors/edit-vendor/edit-vendor.component";
import { DetailVendorComponent } from "./pages/vendors/detail-vendor/detail-vendor.component";
import { AddProductComponent } from "./pages/products/add-product/add-product.component";
import { EditProductComponent } from "./pages/products/edit-product/edit-product.component";
import { DetailProductComponent } from "./pages/products/detail-product/detail-product.component";
import { InputProductComponent } from "./pages/products/input-product/input-product.component";
import { OutputProductComponent } from "./pages/products/output-product/output-product.component";
import { InventoryComponent } from "./pages/products/inventory/inventory.component";
import { TechniciansComponent } from "./pages/technicians/technicians.component";
import { JobsComponent } from "./pages/jobs/jobs.component";
import { PurchaseOrderComponent } from "./pages/purchase-order/purchase-order.component";
import { AddPurchaseOrderComponent } from "./pages/purchase-order/add-purchase-order/add-purchase-order.component";
import { EditPurchaseOrderComponent } from "./pages/purchase-order/edit-purchase-order/edit-purchase-order.component";
import { PrintPurchaseOrderComponent } from "./pages/purchase-order/print-purchase-order/print-purchase-order.component";
import { QuotationsComponent } from "./pages/quotations/quotations.component";
import { AddQuotationComponent } from "./pages/quotations/add-quotation/add-quotation.component";
import { EditQuotationComponent } from "./pages/quotations/edit-quotation/edit-quotation.component";
import { PrintQuotationComponent } from "./pages/quotations/print-quotation/print-quotation.component";
import { CompanyDetailComponent } from "./pages/company-detail/company-detail.component";
import { AddCompanyDetailComponent } from "./pages/company-detail/add-company-detail/add-company-detail.component";
import { EditCompanyDetailComponent } from "./pages/company-detail/edit-company-detail/edit-company-detail.component";
import { InvoicesComponent } from "./pages/invoices/invoices.component";
import { AddInvoiceComponent } from "./pages/invoices/add-invoice/add-invoice.component";
import { EditInvoiceComponent } from "./pages/invoices/edit-invoice/edit-invoice.component";
import { PrintInvoiceComponent } from "./pages/invoices/print-invoice/print-invoice.component";
import { PaymentComponent } from "./pages/payment/payment.component";
import { AddPaymentComponent } from "./pages/payment/add-payment/add-payment.component";
import { EditPaymentComponent } from "./pages/payment/edit-payment/edit-payment.component";
import { PrintPaymentComponent } from "./pages/payment/print-payment/print-payment.component";
import { UserComponent } from "./pages/user/user.component";
import { AddUserComponent } from "./pages/user/add-user/add-user.component";
import { EditUserComponent } from "./pages/user/edit-user/edit-user.component";
import { AuthGuard } from "./auth.guard";
import { ToolsComponent } from "./pages/tools/tools.component";
import { AddToolComponent } from "./pages/tools/add-tool/add-tool.component";
import { EditToolComponent } from "./pages/tools/edit-tool/edit-tool.component";
import { ToolRemoveComponent } from "./pages/tools/tool-remove/tool-remove.component";
import { AddToolOutputComponent } from "./pages/tools/tool-remove/add-tool-output/add-tool-output.component";
import { EditToolOutputComponent } from "./pages/tools/tool-remove/edit-tool-output/edit-tool-output.component";
import { CashManagementComponent } from "./pages/cash-management/cash-management.component";
import { TransactionsComponent } from "./pages/cash-management/transactions/transactions.component";
import { AddTransactionComponent } from "./pages/cash-management/transactions/add-transaction/add-transaction.component";
import { EditTransactionComponent } from "./pages/cash-management/transactions/edit-transaction/edit-transaction.component";
import { ReportsTransactionsComponent } from "./pages/cash-management/reports-transactions/reports-transactions.component";
import { ExpensesComponent } from "./pages/expenses/expenses.component";
import { AddExpenseComponent } from "./pages/expenses/add-expense/add-expense.component";
import { EditExpenseComponent } from "./pages/expenses/edit-expense/edit-expense.component";
import { PrintExpenseComponent } from "./pages/expenses/print-expense/print-expense.component";
import { ReportExpenseComponent } from "./pages/expenses/report-expense/report-expense.component";
import { LogsComponent } from "./pages/logs/logs.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
    title: "ALMAPPS - Login page",
  },
  {
    path: "menu",
    component: MenuListComponent,
    canActivate: [AuthGuard],
    title: "ALMAPPS - Main menu",
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
        title: "ALMAPPS - Dashboard",
      },
      {
        path: "users/list",
        component: UserComponent,
        title: "ALMAPPS - Users",
      },
      {
        path: "users/add",
        component: AddUserComponent,
        title: "ALMAPPS - Add Payments",
      },
      {
        path: "users/edit/:id",
        component: EditUserComponent,
        title: "ALMAPPS - Edit User",
      },
      {
        path: "clients/types",
        component: ClientTypeComponent,
        title: "ALMAPPS - Clients",
      },
      {
        path: "clients/list",
        component: ClientComponent,
        title: "ALMAPPS - Clients",
      },
      {
        path: "clients/add",
        component: AddClientComponent,
        title: "ALMAPPS - Add Clients",
      },
      {
        path: "clients/edit/:id",
        component: EditClientComponent,
        title: "ALMAPPS - Edit Clients",
      },
      {
        path: "clients/detail/:id",
        component: DetailClientComponent,
        title: "ALMAPPS - Details Clients",
      },
      {
        path: "vendors/list",
        component: VendorsComponent,
        title: "ALMAPPS - Vendors",
      },
      {
        path: "vendors/add",
        component: AddVendorComponent,
        title: "ALMAPPS - New Vendors",
      },
      {
        path: "vendors/edit/:id",
        component: EditVendorComponent,
        title: "ALMAPPS - Edit Vendors",
      },
      {
        path: "vendors/detail/:id",
        component: DetailVendorComponent,
        title: "ALMAPPS - Detail Vendors",
      },
      {
        path: "products/list",
        component: ProductsComponent,
        title: "ALMAPPS - Products",
      },
      {
        path: "products/add",
        component: AddProductComponent,
        title: "ALMAPPS - New Products",
      },

      {
        path: "products/edit/:id",
        component: EditProductComponent,
        title: "ALMAPPS - Edit Products",
      },
      {
        path: "products/detail/:id",
        component: DetailProductComponent,
        title: "ALMAPPS - Detail Products",
      },
      {
        path: "products/input",
        component: InputProductComponent,
        title: "ALMAPPS - Inputs Products",
      },

      {
        path: "products/output",
        component: OutputProductComponent,
        title: "ALMAPPS - Outputs Products",
      },

      {
        path: "products/inventory",
        component: InventoryComponent,
        title: "ALMAPPS - Outputs Products",
      },

      {
        path: "technicians/list",
        component: TechniciansComponent,
        title: "ALMAPPS - Technicians",
      },

      {
        path: "technicians/jobs",
        component: JobsComponent,
        title: "ALMAPPS - Jobs",
      },

      {
        path: "Company-infos",
        component: CompanyDetailComponent,
        title: "ALMAPPS - Company Info",
      },

      {
        path: "company-infos/add",
        component: AddCompanyDetailComponent,
        title: "ALMAPPS - New company info",
      },

      {
        path: "company-infos/edit/:id",
        component: EditCompanyDetailComponent,
        title: "ALMAPPS - Edit company info",
      },

      {
        path: "purchase-orders/list",
        component: PurchaseOrderComponent,
        title: "ALMAPPS - Purchase order",
      },
      {
        path: "purchase-order/add",
        component: AddPurchaseOrderComponent,
        title: "ALMAPPS - New Purchase order",
      },
      {
        path: "purchase-order/edit/:id",
        component: EditPurchaseOrderComponent,
        title: "ALMAPPS - Edit Purchase order",
      },
      {
        path: "purchase-order/print/:id",
        component: PrintPurchaseOrderComponent,
        title: "ALMAPPS - Print Purchase order",
      },

      {
        path: "quotations/list",
        component: QuotationsComponent,
        title: "ALMAPPS - Quotations",
      },

      {
        path: "quotations/add",
        component: AddQuotationComponent,
        title: "ALMAPPS - Add Quotations",
      },
      {
        path: "quotations/edit/:id",
        component: EditQuotationComponent,
        title: "ALMAPPS - Edit Quotations",
      },
      {
        path: "quotations/print/:id",
        component: PrintQuotationComponent,
        title: "ALMAPPS - Print Quotations",
      },

      {
        path: "invoices/list",
        component: InvoicesComponent,
        title: "ALMAPPS - Invoices",
      },

      {
        path: "invoices/add",
        component: AddInvoiceComponent,
        title: "ALMAPPS - Add Invoice",
      },
      {
        path: "invoices/edit/:id",
        component: EditInvoiceComponent,
        title: "ALMAPPS - Edit Invoice",
      },
      {
        path: "invoices/print/:id",
        component: PrintInvoiceComponent,
        title: "ALMAPPS - Print Invoice",
      },

      {
        path: "payments/list",
        component: PaymentComponent,
        title: "ALMAPPS - Payments",
      },
      {
        path: "payments/add",
        component: AddPaymentComponent,
        title: "ALMAPPS - Add Payments",
      },
      {
        path: "payments/edit/:id",
        component: EditPaymentComponent,
        title: "ALMAPPS - Edit Payments",
      },
      {
        path: "payments/print/:id",
        component: PrintPaymentComponent,
        title: "ALMAPPS - Print Payments",
      },

      {
        path: "tools/list",
        component: ToolsComponent,
        title: "ALMAPPS - Tools",
      },
      {
        path: "tools/add",
        component: AddToolComponent,
        title: "ALMAPPS - Add Tool",
      },
      {
        path: "tools/edit/:id",
        component: EditToolComponent,
        title: "ALMAPPS - Edit Tool",
      },
      {
        path: "release/list",
        component: ToolRemoveComponent,
        title: "ALMAPPS - Tools release",
      },
      {
        path: "release/add",
        component: AddToolOutputComponent,
        title: "ALMAPPS - Add Tools release",
      },
      {
        path: "release/edit/:id",
        component: EditToolOutputComponent,
        title: "ALMAPPS - Edit Tools release",
      },

      {
        path: "cash-management/list",
        component: CashManagementComponent,
        title: "ALMAPPS - Cash management",
      },
      {
        path: "cash-management/transactions/:id",
        component: ReportsTransactionsComponent,
        title: "ALMAPPS - Cash management",
      },
      {
        path: "transactions/list",
        component: TransactionsComponent,
        title: "ALMAPPS - Cash transactions",
      },
      {
        path: "transactions/add",
        component: AddTransactionComponent,
        title: "ALMAPPS - Add Cash transactions",
      },
      {
        path: "transactions/edit/:id",
        component: EditTransactionComponent,
        title: "ALMAPPS - Edit Cash transactions",
      },

      {
        path: "expenses/list",
        component: ExpensesComponent,
        title: "ALMAPPS - Expenses",
      },
      {
        path: "expenses/report",
        component: ReportExpenseComponent,
        title: "ALMAPPS - Report Expenses",
      },
      {
        path: "expenses/add",
        component: AddExpenseComponent,
        title: "ALMAPPS - Add Expenses",
      },
      {
        path: "expenses/edit/:id",
        component: EditExpenseComponent,
        title: "ALMAPPS - Add Expenses",
      },
      {
        path: "expenses/print/:id",
        component: PrintExpenseComponent,
        title: "ALMAPPS - Print Expenses",
      },
      {
        path: "logs",
        component: LogsComponent,
        title: "ALMAPPS - Logs",
      },
      {
        path: "users/profile",
        component: UserProfileComponent,
        title: "ALMAPPS - Logs",
      },
    ],
  },
  // { path: "**", redirectTo: "login" }, // optional 404 fallback
];
