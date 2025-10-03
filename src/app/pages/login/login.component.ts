import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { response } from "express";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  email = "";
  password = "";

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log(response);
        this.router.navigate(["/menu"]);
      },
    });
  }
}
