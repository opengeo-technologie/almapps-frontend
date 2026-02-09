import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  imports: [CommonModule],
  standalone: true,
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent {
  activeLink: any = "";

  constructor(private router: Router) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    this.activeLink = this.router.url;
    console.log(this.activeLink);
  }
}
