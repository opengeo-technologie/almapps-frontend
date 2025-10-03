import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../../services/product.service";
import { Router } from "@angular/router";
import { UserService } from "../../../services/user.service";
declare var M: any;

@Component({
  selector: "app-form-user",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-user.component.html",
  styleUrl: "./form-user.component.css",
})
export class FormUserComponent {
  @Input() user: any;
  profiles: any;
  isAddForm: boolean;

  constructor(private userService: UserService, private router: Router) {
    this.isAddForm = this.router.url.includes("add");
  }

  ngOnInit() {
    this.userService.getUserProfiles().subscribe({
      next: (data) => (this.profiles = data),
      error: (err) => console.error(err),
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id && c1.role === c2.role : c1 === c2;
  }

  onSubmit() {
    // console.log(this.client);
    this.user.profile_id = this.user.profile.id;
    if (this.isAddForm) {
      this.user.is_active = true;
      this.userService.saveUser(this.user).subscribe({
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
            this.router.navigate(["/users/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    } else {
      this.userService.updateUser(this.user).subscribe({
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
            this.router.navigate(["/users/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    }
  }
}
