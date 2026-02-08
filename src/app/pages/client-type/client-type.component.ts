import { Component } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { Router } from "@angular/router";
import { ClientService } from "../../services/client.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-client-type",
  imports: [CommonModule, BaseComponent],
  standalone: true,
  templateUrl: "./client-type.component.html",
  styleUrl: "./client-type.component.css",
})
export class ClientTypeComponent {
  submenus: any[] = [
    {
      url: "/clients/types",
      name: "Types clients",
      icon: "people.svg",
    },
    {
      url: "/clients/list",
      name: "Clients list",
      icon: "list.svg",
    },
  ];

  types: any[] = [];

  currentPage = 1;
  rowsPerPage = 5;

  constructor(private router: Router, private clientService: ClientService) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    this.clientService.getTypeClients().subscribe({
      next: (data) => {
        console.log(data);
        this.types = data;
      },
      error: (err) => console.error(err),
    });
    // console.log(this.userLocation)
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.types.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.types.length / this.rowsPerPage);
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
