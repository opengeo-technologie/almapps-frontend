import { CommonModule } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-logs",
  imports: [CommonModule, BaseComponent],
  standalone: true,
  templateUrl: "./logs.component.html",
  styleUrl: "./logs.component.css",
})
export class LogsComponent {
  submenus: any[] = [
    {
      url: "/users/profile",
      name: "Users profiles",
      icon: "project-manager.svg",
    },
    {
      url: "/users/list",
      name: "Users",
      icon: "people.svg",
    },
    {
      url: "/users/rigths",
      name: "Users Rights",
      icon: "rights.svg",
    },
    {
      url: "/logs",
      name: "Logs",
      icon: "log-file.svg",
    },
  ];

  currentPage = 1;
  rowsPerPage = 10;

  logs: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    // console.log(this.userLocation)
    this.loadData();
  }

  loadData() {
    this.userService.getLogs().subscribe({
      next: (data) => {
        // console.log(data.logs);
        this.logs = data.logs;
      },
      error: (err) => console.error(err),
    });
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.logs.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.logs.length / this.rowsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
