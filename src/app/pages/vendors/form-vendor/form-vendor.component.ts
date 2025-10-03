import { Component, Input } from "@angular/core";
import { ProductService } from "../../../services/product.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
declare var M: any;

@Component({
  selector: "app-form-vendor",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-vendor.component.html",
  styleUrl: "./form-vendor.component.css",
})
export class FormVendorComponent {
  @Input() vendor: any;
  isAddForm: boolean;

  constructor(private clientService: ProductService, private router: Router) {
    this.isAddForm = this.router.url.includes("add");
  }

  ngOnInit() {
    // console.log(this.client);
    // this.isClientInformation = true;
    // console.log(this.client);
  }

  onSubmit() {
    // console.log(this.client);
    if (this.isAddForm) {
      this.clientService.saveVendor(this.vendor).subscribe({
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
            this.router.navigate(["/vendors/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    } else {
      this.clientService.updateVendor(this.vendor).subscribe({
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
            this.router.navigate(["/vendors/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    }
  }
}
