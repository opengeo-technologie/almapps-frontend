import { Component } from "@angular/core";
import { FormClientComponent } from "../form-client/form-client.component";
import { BaseComponent } from "../../base/base.component";
import { ActivatedRoute } from "@angular/router";
import { ClientService } from "../../../services/client.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-edit-client",
  imports: [FormClientComponent, BaseComponent, CommonModule],
  standalone: true,
  templateUrl: "./edit-client.component.html",
  styleUrl: "./edit-client.component.css",
})
export class EditClientComponent {
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
}
