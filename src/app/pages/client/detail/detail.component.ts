import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientService } from "../../../services/client.service";
import { BaseComponent } from "../../base/base.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-detail-client",
  imports: [BaseComponent, CommonModule],
  standalone: true,
  templateUrl: "./detail.component.html",
  styleUrl: "./detail.component.css",
})
export class DetailClientComponent {
  client: any | undefined;

  contact: any | undefined;
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientservice: ClientService
  ) {}

  ngOnInit() {
    const clientId: string | null = this.route.snapshot.paramMap.get("id");
    if (clientId) {
      // console.log(clientId);
      this.clientservice.getClient(+clientId).subscribe((client) => {
        // console.log(client);
        // this.client = client;
        this.clientservice.getTypeClient(client.type_id).subscribe((type) => {
          delete client.type_id;
          client.type = type;
          this.client = client;

          if (type.id == 2) {
            this.clientservice
              .getClientContact(client.id)
              .subscribe((contact) => {
                this.contact = contact;
              });
          }
        });
      });
    } else {
      this.client = undefined;
    }
  }

  editClient(client: any) {
    this.router.navigate(["/clients/edit", client.id]);
  }

  returnClientList() {
    this.router.navigate(["/clients/list"]);
  }
}
