import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { NavigationEnd, Router } from "@angular/router";
import { ClientService } from "../../services/client.service";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Subscription } from "rxjs";
declare var M: any;

@Component({
  selector: "app-client",
  imports: [CommonModule, BaseComponent],
  standalone: true,
  templateUrl: "./client.component.html",
  styleUrl: "./client.component.css",
})
export class ClientComponent {
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

  clients: any[] = [];
  instanceModal: any;
  clientToDelete: any;
  private navSub?: Subscription;

  currentPage = 1;
  rowsPerPage = 5;

  constructor(
    private router: Router,
    private clientService: ClientService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // this.userLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
  }

  ngOnInit(): void {
    // console.log(this.userLocation)
    this.loadData();
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    if (isPlatformBrowser(this.platformId)) {
      this.initModals();

      // Re-init modals on every navigation (important for SSR refresh)
      this.navSub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.initModals();
        }
      });
    }
  }

  loadData() {
    this.clientService.getClients().subscribe({
      next: (data) => (this.clients = data),
      error: (err) => console.error(err),
    });
  }

  initModals() {
    const elem = document.getElementById("confirmDelete");
    // console.log(elem);
    const options = {
      dismissible: false,
    };
    this.instanceModal = M.Modal.init(elem, options);
  }

  ngOnDestroy() {
    this.navSub?.unsubscribe();
  }

  editClient(client: any) {
    this.router.navigate(["/clients/edit", client.id]);
  }

  detailClient(client: any) {
    this.router.navigate(["/clients/detail", client.id]);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.clients.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.clients.length / this.rowsPerPage);
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

  confirmDeleteClient(client: any) {
    this.clientToDelete = client;
    this.instanceModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  deleteClient() {
    console.log(this.clientToDelete);
    if (this.clientToDelete.type_id == 2) {
      this.clientService
        .getClientContact(this.clientToDelete.id)
        .subscribe((contact) => {
          this.clientService.deleteClientContact(contact).subscribe({
            next: (item) => {
              if (item.status == 202) {
                this.clientService.deleteClient(this.clientToDelete).subscribe({
                  next: (response) => {
                    if (response.status == 202) {
                      // Handle the response from the server
                      M.toast({
                        html: "Data deleted successfully....",
                        classes: "rounded red accent-4",
                        inDuration: 500,
                        outDuration: 575,
                      });
                      this.loadData();
                      this.closeModal();
                    }
                  },
                });
              }
            },
          });
        });
    } else {
      this.clientService.deleteClient(this.clientToDelete).subscribe({
        next: (response) => {
          if (response.status == 202) {
            // Handle the response from the server
            M.toast({
              html: "Data deleted successfully....",
              classes: "rounded red accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            this.loadData();
            this.closeModal();
          }
        },
      });
    }
  }
}
