import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormUserComponent } from "../form-user/form-user.component";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../../../services/user.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-edit-user",
  imports: [BaseComponent, FormUserComponent, CommonModule],
  standalone: true,
  templateUrl: "./edit-user.component.html",
  styleUrl: "./edit-user.component.css",
})
export class EditUserComponent {
  user: any | undefined;
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

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    const user_id: string | null = this.route.snapshot.paramMap.get("id");
    if (user_id) {
      // console.log(clientId);
      this.userService.getUser(+user_id).subscribe((user) => {
        console.log(user);
        this.user = user;
      });
    } else {
      this.user = undefined;
    }
  }
}
