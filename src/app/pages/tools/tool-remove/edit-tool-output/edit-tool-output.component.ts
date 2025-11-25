import { Component } from "@angular/core";
import { BaseComponent } from "../../../base/base.component";
import { FormToolOutputComponent } from "../form-tool-output/form-tool-output.component";
import { ActivatedRoute } from "@angular/router";
import { ToolsService } from "../../../../services/tools.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-edit-tool-output",
  imports: [BaseComponent, FormToolOutputComponent, CommonModule],
  standalone: true,
  templateUrl: "./edit-tool-output.component.html",
  styleUrl: "./edit-tool-output.component.css",
})
export class EditToolOutputComponent {
  tool_output: any | undefined;

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
      this.toolService.getToolOutput(+toolId).subscribe((tool) => {
        // console.log(tool);
        this.tool_output = tool;
      });
    } else {
      this.tool_output = undefined;
    }
  }
}
