import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormUserComponent } from "../form-user/form-user.component";

@Component({
  selector: "app-add-user",
  imports: [BaseComponent, FormUserComponent],
  standalone: true,
  templateUrl: "./add-user.component.html",
  styleUrl: "./add-user.component.css",
})
export class AddUserComponent {
  user: any = {
    username: "",
    email: "",
    password: "",
    profile: null,
  };
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
      url: "/logs",
      name: "Logs",
      icon: "log-file.svg",
    },
  ];

  ngOnInit(): void {}
}
