import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID, ViewChild } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ProductService } from "../../services/product.service";
import { BaseComponent } from "../base/base.component";
import { FormsModule, NgForm } from "@angular/forms";
import { JobsService } from "../../services/jobs.service";
import { TechnicianService } from "../../services/technician.service";
import { CustomCurrencyPipe } from "../../pipes/currency.pipe";
declare var M: any;

@Component({
  selector: "app-jobs",
  imports: [CommonModule, BaseComponent, FormsModule, CustomCurrencyPipe],
  standalone: true,
  templateUrl: "./jobs.component.html",
  styleUrl: "./jobs.component.css",
})
export class JobsComponent {
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

  job: any = {
    job_name: "",
    job_description: "",
    duration: "",
    price: 0,
    date_program: Date.now,
  };

  assign_tech: any = {
    technician: null,
    date_start: null,
    date_end: null,
    amount: 0,
  };

  technicians: any[] = [];
  assignedTechnicians: any[] = [];
  copyAssignedTechnicians: any[] = [];
  removedAssignTechnicians: any[] = [];
  newAssignedTechnicians: any[] = [];
  jobs: any[] = [];
  instanceModal: any;
  jobToDelete: any;
  newTechModal: any;
  assignTechModal: any;
  changeJobStatus: any;
  status: boolean = false;
  private navSub?: Subscription;
  isAddForm: boolean = true;

  currentPage = 1;
  rowsPerPage = 5;

  constructor(
    private router: Router,
    private jobService: JobsService,
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
      const textarea1 = document.getElementById("description");
      M.textareaAutoResize(textarea1);

      // Re-init modals on every navigation (important for SSR refresh)
      this.navSub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.initModals();
        }
      });
    }
  }

  loadData() {
    this.jobService.getJobs().subscribe({
      next: (data) => (this.jobs = data),
      error: (err) => console.error(err),
    });
  }

  loadTechnicians() {
    this.techService.getTechnicians().subscribe({
      next: (data) => {
        // console.log("All technicians: " + data);
        this.technicians = data;
      },
      error: (err) => console.error(err),
    });
  }

  loadAssignJobTechnicians(job_id: number) {
    this.jobService.getJobAssignTechnicians(job_id).subscribe({
      next: (data) => {
        // console.log("Assign Technicians" + data);
        this.assignedTechnicians = data;
      },
      error: (err) => console.error(err),
    });
  }

  initModals() {
    const elem = document.getElementById("confirmDelete");
    const new_edit_job = document.getElementById("new_edit_job");
    const assign_tech = document.getElementById("assign_tech");
    const change_job_status = document.getElementById("confirmJobStatus");
    // console.log(elem);
    const options = {
      dismissible: false,
    };
    this.instanceModal = M.Modal.init(elem, options);
    this.newTechModal = M.Modal.init(new_edit_job, options);
    this.assignTechModal = M.Modal.init(assign_tech, options);
    this.changeJobStatus = M.Modal.init(change_job_status, options);
  }

  ngOnDestroy() {
    this.navSub?.unsubscribe();
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.jobs.slice(start, start + this.rowsPerPage);
  }

  totalPages() {
    return Math.ceil(this.jobs.length / this.rowsPerPage);
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

  newJob() {
    this.isAddForm = true;
    this.job = {
      job_name: "",
      job_description: "",
      duration: "",
      price: 0,
      date_program: null,
    };
    this.newTechModal.open();
  }

  get filteredTechnicians() {
    let tech = [...this.technicians];
    return tech.filter(
      (itemA) =>
        !this.assignedTechnicians.some((itemB) => itemB.id === itemA.id)
    );
  }

  assignTech(job: any) {
    this.isAddForm = true;
    this.loadAssignJobTechnicians(job.id);
    this.loadTechnicians();
    this.job = job;
    this.assignTechModal.open();
  }

  addTechnicianToList() {
    const tech = { ...this.assign_tech };
    this.assignedTechnicians.push(tech.technician);
    // console.log(this.assignTechnicians);
    this.newAssignedTechnicians.push(tech);
    this.assign_tech = {
      technician: null,
      date_start: null,
      date_end: null,
    };
  }

  invalidBtn() {
    return (
      this.removedAssignTechnicians.length == 0 &&
      this.newAssignedTechnicians.length == 0
    );
  }

  removeTechnicianToList(technician: any) {
    this.removedAssignTechnicians.push(technician);
    // console.log(this.removedAssignTechnicians);
    // console.log(this.invalidBtn());
    this.assignedTechnicians = this.assignedTechnicians.filter(
      (itemA) => technician.id !== itemA.id
    );
  }

  edit(job: any) {
    // console.log(technician);
    this.isAddForm = false;
    this.job = job;
    this.newTechModal.open();
  }

  confirmDelete(job: any) {
    this.jobToDelete = job;
    this.instanceModal.open();
  }

  closeModal() {
    this.instanceModal.close();
  }

  deleteJob() {
    this.jobService.deleteJob(this.jobToDelete).subscribe((response) => {
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
    // console.log(this.job);
    if (this.isAddForm) {
      this.jobService.saveJob(this.job).subscribe({
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
      this.jobService.updateJob(this.job).subscribe({
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

  onSubmitAssignTechnicians(job: any) {
    for (const item of this.newAssignedTechnicians) {
      // console.log(item);
      const object = {
        job_id: job.id,
        technician_id: item.technician.id,
        date_start: item.date_start,
        date_end: item.date_end,
        amount: item.amount,
      };
      this.jobService.saveJobAssignTechnician(object).subscribe({
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
            // this.loadData();
            this.assignTechModal.close();
            this.newAssignedTechnicians = [];
          }
        },
        error: (err) => console.error(err),
      });
    }
    if (this.removedAssignTechnicians.length != 0) {
      for (const technician in this.removedAssignTechnicians) {
        console.log(technician);
        // this.jobService
        //   .deleteJobAssignTechnician(job.id, technician.id)
        //   .subscribe((response) => {
        //     if (response.status == 202) {
        //       // Handle the response from the server
        //       M.toast({
        //         html: "Data deleted successfully....",
        //         classes: "rounded red accent-4",
        //         inDuration: 500,
        //         outDuration: 575,
        //       });
        //       this.loadData();
        //       this.closeModal();
        //     }
        //   });
      }
    }
  }

  confirmStatusChange(item: any, status: boolean) {
    this.job = item;
    this.status = status;
    this.changeJobStatus.open();
  }

  onChangeJobStatus() {
    this.job.status = this.status;
    this.jobService.updateJob(this.job).subscribe({
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
