import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { ToolsService } from "../../../services/tools.service";
declare var M: any;

@Component({
  selector: "app-tool-remove",
  imports: [CommonModule, BaseComponent],
  standalone: true,
  templateUrl: "./tool-remove.component.html",
  styleUrl: "./tool-remove.component.css",
})
export class ToolRemoveComponent {
  submenus: any[] = [
    {
      url: "/tools/list",
      name: "Tools",
      icon: "vendor.svg",
    },
    {
      url: "/release/list",
      name: "Tools removal",
      icon: "maintenance.svg",
    },
  ];

  items: any[] = [];
  instanceModal: any;
  productToDelete: any;
  private navSub?: Subscription;

  currentPage = 1;
  rowsPerPage = 5;

  constructor(
    private router: Router,
    private toolService: ToolsService,
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
    this.toolService.getToolOutputs().subscribe({
      next: (data) => (this.items = data),
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
    this.router.navigate(["/release/edit", client.id]);
  }

  detailClient(client: any) {
    this.router.navigate(["/tools/detail", client.id]);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.items.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.items.length / this.rowsPerPage);
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
    this.productToDelete = client;
    this.instanceModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  deleteTool() {
    // console.log(this.vendorToDelete);
    this.toolService.deleteTool(this.productToDelete).subscribe((response) => {
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
    });
  }
}
