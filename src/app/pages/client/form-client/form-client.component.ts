import { HttpEventType } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { ClientService } from "../../../services/client.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
declare var M: any;

@Component({
  selector: "app-form-client",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-client.component.html",
  styleUrl: "./form-client.component.css",
})
export class FormClientComponent {
  @Input() client: any;
  @Input() contact: any;
  isAddForm: boolean;
  types: any[] = [];
  typeClient: any;
  // clientForm: NgForm;
  selectedTypeId: number = 0;
  response: boolean = false;
  isCompany: boolean = false;

  constructor(private clientService: ClientService, private router: Router) {
    this.isAddForm = this.router.url.includes("add");
    this.clientService.getTypeClients().subscribe((types: any[]) => {
      this.types = types;
      if (!this.isAddForm) {
        if (this.client.type.id == 2) {
          this.isCompany = true;
        } else {
          this.contact = {
            name: "",
            email: "",
            phone: "",
            client_id: 0,
          };
        }
      }
    });
  }

  ngOnInit() {
    // console.log(this.client);
    // this.isClientInformation = true;
    // console.log(this.client);
  }

  selectType(event: Event) {
    // console.log(this.client.type);
    if (this.client.type.id == 2) {
      this.isCompany = true;
    } else {
      this.isCompany = false;
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id && c1.type === c2.type : c1 === c2;
  }

  onSubmit() {
    // console.log(this.client);
    const type_id = this.client.type.id;
    delete this.client.type;
    this.client.type_id = type_id;
    if (this.isAddForm) {
      this.clientService.saveClient(this.client).subscribe({
        next: (data) => {
          // console.log(data.status);
          if (data.status == 201) {
            if (type_id == 2) {
              this.contact.client_id = data.body.id;
              this.clientService.saveClientContact(this.contact).subscribe({
                next: (event) => {},
              });
            }
            // Handle the response from the server
            M.toast({
              html: "Data created successfully....",
              classes: "rounded green accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            // this.loadItems();
            this.router.navigate(["/clients/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    } else {
      this.clientService.updateClient(this.client).subscribe({
        next: (data) => {
          // console.log(data);
          if (data.status == 204) {
            if (type_id == 2) {
              this.contact.client_id = this.client.id;
              if (this.contact.hasOwnProperty("id")) {
                // console.log("id exists:", this.contact.id);
                this.clientService.updateClientContact(this.contact).subscribe({
                  next: (event) => {},
                });
              } else {
                this.clientService.saveClientContact(this.contact).subscribe({
                  next: (event) => {},
                });
              }
            } else if (type_id == 1 && this.contact.hasOwnProperty("id")) {
              this.clientService.deleteClientContact(this.contact).subscribe({
                next: (event) => {},
              });
            }
            // Handle the response from the server
            M.toast({
              html: "Data updated successfully....",
              classes: "rounded green accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            // this.loadItems();
            this.router.navigate(["/clients/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    }
  }
}
