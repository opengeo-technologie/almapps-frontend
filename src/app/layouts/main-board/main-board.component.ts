import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-main-board",
  imports: [],
  standalone: true,
  templateUrl: "./main-board.component.html",
  styleUrl: "./main-board.component.css",
})
export class MainBoardComponent {
  activeLink: any = "";
  constructor(
    private router: Router,
    private apiService: AuthService,
  ) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    this.activeLink = this.router.url;
  }

  logout() {
    this.apiService.logout();
  }
}
