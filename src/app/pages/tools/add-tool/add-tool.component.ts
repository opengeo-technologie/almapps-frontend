import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormToolComponent } from "../form-tool/form-tool.component";

@Component({
  selector: "app-add-tool",
  imports: [BaseComponent, FormToolComponent],
  standalone: true,
  templateUrl: "./add-tool.component.html",
  styleUrl: "./add-tool.component.css",
})
export class AddToolComponent {
  tool: any = {
    name: "",
    description: "",
    stock_level: 0.0,
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
}
