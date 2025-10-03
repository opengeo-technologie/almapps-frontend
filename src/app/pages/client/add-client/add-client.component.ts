import { Component } from "@angular/core";
import { FormClientComponent } from "../form-client/form-client.component";
import { BaseComponent } from "../../base/base.component";

@Component({
  selector: "app-add-client",
  imports: [FormClientComponent, BaseComponent],
  standalone: true,
  templateUrl: "./add-client.component.html",
  styleUrl: "./add-client.component.css",
})
export class AddClientComponent {
  client: any = {
    name: "",
    address: "",
    email: "",
    phone: "",
    postal: "",
    nui: "",
    rc: "",
    type: null,
  };

  contact: any = {
    name: "",
    email: "",
    phone: "",
    client_id: 0,
  };
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

  ngOnInit(): void {}
}
