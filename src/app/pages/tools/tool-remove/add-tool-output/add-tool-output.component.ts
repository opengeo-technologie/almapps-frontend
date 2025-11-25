import { Component } from "@angular/core";
import { BaseComponent } from "../../../base/base.component";
import { FormToolOutputComponent } from "../form-tool-output/form-tool-output.component";
import { AuthService } from "../../../../services/auth.service";

@Component({
  selector: "app-add-tool-output",
  imports: [BaseComponent, FormToolOutputComponent],
  standalone: true,
  templateUrl: "./add-tool-output.component.html",
  styleUrl: "./add-tool-output.component.css",
})
export class AddToolOutputComponent {
  tool_output: any = {
    tool: null,
    technician: null,
    date_output: null,
    user_id: 0,
    quantity: 0,
  };

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

  constructor(private authService: AuthService) {
    const userData = this.authService.getUser();
    if (userData) {
      // console.log(JSON.parse(userData));
      this.tool_output.user_id = JSON.parse(userData).id;
    }
  }
}
