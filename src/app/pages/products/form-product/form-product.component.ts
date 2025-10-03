import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../../services/product.service";
import { Router } from "@angular/router";
declare var M: any;

@Component({
  selector: "app-form-product",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-product.component.html",
  styleUrl: "./form-product.component.css",
})
export class FormProductComponent {
  @Input() product: any;
  isAddForm: boolean;

  constructor(private productService: ProductService, private router: Router) {
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
      this.productService.saveProduct(this.product).subscribe({
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
            this.router.navigate(["/products/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    } else {
      this.productService.updateProduct(this.product).subscribe({
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
            this.router.navigate(["/products/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    }
  }
}
