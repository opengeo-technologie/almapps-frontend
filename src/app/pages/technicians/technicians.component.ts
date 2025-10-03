import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ProductService } from "../../services/product.service";
import { BaseComponent } from "../base/base.component";
import { TechnicianService } from "../../services/technician.service";
import { FormsModule } from "@angular/forms";
declare var M: any;

@Component({
  selector: "app-technicians",
  imports: [CommonModule, BaseComponent, FormsModule],
  standalone: true,
  templateUrl: "./technicians.component.html",
  styleUrl: "./technicians.component.css",
})
export class TechniciansComponent {
  submenus: any[] = [
    {
      url: "/technicians/list",
      name: "Technicians",
      icon: "011-technician.svg",
    },
    {
      url: "/technicians/jobs",
      name: "Jobs",
      icon: "task.svg",
    },
  ];

  technician: any = {
    name: "",
    email: "",
    phone: "",
    role: null,
  };

  roles: any[] = [];
  technicians: any[] = [];
  instanceModal: any;
  techToDelete: any;
  newTechModal: any;
  private navSub?: Subscription;
  isAddForm: boolean = true;

  currentPage = 1;
  rowsPerPage = 5;

  constructor(
    private router: Router,
    private techService: TechnicianService,
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
    this.techService.getTechnicians().subscribe({
      next: (data) => (this.technicians = data),
      error: (err) => console.error(err),
    });

    this.techService.getTechRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => console.error(err),
    });
  }

  initModals() {
    const elem = document.getElementById("confirmDelete");
    const new_tech = document.getElementById("new_tech");
    // console.log(elem);
    const options = {
      dismissible: false,
    };
    this.instanceModal = M.Modal.init(elem, options);
    this.newTechModal = M.Modal.init(new_tech, options);
  }

  ngOnDestroy() {
    this.navSub?.unsubscribe();
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.technicians.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.technicians.length / this.rowsPerPage);
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

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id && c1.role === c2.role : c1 === c2;
  }

  newTechnician() {
    this.isAddForm = true;
    this.technician = {
      name: "",
      email: "",
      phone: "",
      role: null,
    };
    this.newTechModal.open();
  }

  edit(technician: any) {
    // console.log(technician);
    this.isAddForm = false;
    this.technician = technician;
    this.newTechModal.open();
  }

  confirmDelete(tech: any) {
    this.techToDelete = tech;
    this.instanceModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  deleteTechnician() {
    // console.log(this.vendorToDelete);
    this.techService
      .deleteTechnician(this.techToDelete)
      .subscribe((response) => {
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

  onSubmit() {
    // console.log(this.technician);
    const role_id = this.technician.role.id;

    const tech = { ...this.technician };

    // console.log(tech);
    delete tech.role;
    tech.role_id = role_id;
    if (this.isAddForm) {
      this.techService.saveTechnician(tech).subscribe({
        next: (data) => {
          // console.log(data);
          if (data.status == 201) {
            // Handle the response from the server
            M.toast({
              html: "Data created successfully....",
              classes: "rounded green accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            this.loadData();
            this.newTechModal.close();
          }
        },
        error: (err) => console.error(err),
      });
    } else {
      this.techService.updateTechnician(tech).subscribe({
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
            this.loadData();
            this.newTechModal.close();
          }
        },
        error: (err) => console.error(err),
      });
    }
  }
}
