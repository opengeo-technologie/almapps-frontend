import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { NavigationEnd, Router } from "@angular/router";
import { ClientService } from "../../services/client.service";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Subscription } from "rxjs";
import { UserService } from "../../services/user.service";
declare var M: any;

@Component({
  selector: "app-user",
  imports: [CommonModule, BaseComponent],
  standalone: true,
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
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
      url: "/users/logs",
      name: "Logs",
      icon: "log-file.svg",
    },
  ];

  users: any[] = [];
  instanceModal: any;
  resetPasswordModal: any;
  deleteUserModal: any;
  userSelected: any;
  private navSub?: Subscription;

  currentPage = 1;
  rowsPerPage = 5;

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
    this.userService.getUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error(err),
    });
  }

  initModals() {
    const elem = document.getElementById("ChangeAccountStatusModal");
    const elemPwd = document.getElementById("resetPwdModal");
    const elemDelete = document.getElementById("confirmDeleteModal");
    // console.log(elem);
    const options = {
      dismissible: false,
    };
    this.instanceModal = M.Modal.init(elem, options);
    this.resetPasswordModal = M.Modal.init(elemPwd, options);
    this.deleteUserModal = M.Modal.init(elemDelete, options);
  }

  ngOnDestroy() {
    this.navSub?.unsubscribe();
  }

  editClient(client: any) {
    this.router.navigate(["/users/edit", client.id]);
  }

  detailClient(client: any) {
    this.router.navigate(["/users/detail", client.id]);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.users.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.users.length / this.rowsPerPage);
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

  confirmStatusChange(user: any) {
    this.userSelected = user;
    this.instanceModal.open();
  }

  confirmPasswordReset(user: any) {
    this.userSelected = user;
    this.resetPasswordModal.open();
  }

  confirmDeleteClient(user: any) {
    this.userSelected = user;
    this.deleteUserModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  changeUserStatus() {
    if (this.userSelected.is_active) {
      this.userSelected.is_active = false;
    } else {
      this.userSelected.is_active = true;
    }
    this.userService.updateUser(this.userSelected).subscribe({
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
          this.closeModal();
        }
      },
      error: (err) => console.error(err),
    });
  }

  resetUserPassword() {
    this.userSelected.password = "Almapps2025!";
    this.userService.resetUserPassword(this.userSelected).subscribe({
      next: (data) => {
        // console.log(data);
        if (data.status == 204) {
          // Handle the response from the server
          M.toast({
            html: "Password updated successfully....",
            classes: "rounded green accent-4",
            inDuration: 500,
            outDuration: 575,
          });
          this.loadData();
          this.closeModal();
        }
      },
      error: (err) => console.error(err),
    });
  }
}
