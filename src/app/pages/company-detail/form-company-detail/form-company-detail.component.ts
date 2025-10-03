import { HttpEventType } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { ClientService } from "../../../services/client.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { CompanyDetailService } from "../../../services/company-detail.service";
declare var M: any;

@Component({
  selector: "app-form-company-detail",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-company-detail.component.html",
  styleUrl: "./form-company-detail.component.css",
})
export class FormCompanyDetailComponent {
  @Input() company: any;
  isAddForm: boolean;
  types: any[] = [];
  typeClient: any;
  // clientForm: NgForm;
  selectedTypeId: number = 0;
  response: boolean = false;
  isCompany: boolean = true;

  constructor(
    private companyService: CompanyDetailService,
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
    return c1 && c2 ? c1.id === c2.id && c1.type === c2.type : c1 === c2;
  }

  onSubmit() {
    if (this.isAddForm) {
      this.companyService.saveCompanyDetail(this.company).subscribe({
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
            this.router.navigate(["/Company-infos"]);
          }
        },
        error: (err) => console.error(err),
      });
    } else {
      this.companyService.updateCompanyDetail(this.company).subscribe({
        next: (data) => {
          // console.log(data);
          if (data.status == 204) {
            // Handle the response from the server
            M.toast({
              html: "Data updated successfully....",
              classes: "rounded green accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            // this.loadItems();
            this.router.navigate(["/Company-infos"]);
          }
        },
        error: (err) => console.error(err),
      });
    }
  }
}
