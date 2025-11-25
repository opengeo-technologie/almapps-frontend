import { Component } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { FormToolComponent } from "../form-tool/form-tool.component";
import { ActivatedRoute } from "@angular/router";
import { ToolsService } from "../../../services/tools.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-edit-tool",
  imports: [BaseComponent, FormToolComponent, CommonModule],
  standalone: true,
  templateUrl: "./edit-tool.component.html",
  styleUrl: "./edit-tool.component.css",
})
export class EditToolComponent {
  tool: any | undefined;

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

  constructor(
    private route: ActivatedRoute,
    private toolService: ToolsService
  ) {}

  ngOnInit() {
    const toolId: string | null = this.route.snapshot.paramMap.get("id");
    if (toolId) {
      // console.log(clientId);
      this.toolService.getTool(+toolId).subscribe((tool) => {
        // console.log(tool);
        this.tool = tool;
      });
    } else {
      this.tool = undefined;
    }
  }
}
