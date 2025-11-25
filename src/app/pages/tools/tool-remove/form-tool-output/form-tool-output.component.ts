import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ToolsService } from "../../../../services/tools.service";
import { TechnicianService } from "../../../../services/technician.service";
declare var M: any;

@Component({
  selector: "app-form-tool-output",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-tool-output.component.html",
  styleUrl: "./form-tool-output.component.css",
})
export class FormToolOutputComponent {
  @Input() tool_output: any;
  isAddForm: boolean;
  tools: any[] = [];
  technicians: any[] = [];

  constructor(
    private toolService: ToolsService,
    private router: Router,
    private technicianService: TechnicianService
  ) {
    this.isAddForm = this.router.url.includes("add");
  }

  ngOnInit() {
    // console.log(this.client);
    // this.isClientInformation = true;
    console.log(this.tool_output);
    this.loadData();
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  loadData() {
    this.toolService.getTools().subscribe({
      next: (data) => {
        // console.log(data);
        this.tools = data;
      },
      error: (err) => console.error(err),
    });
    this.technicianService.getTechnicians().subscribe({
      next: (data) => {
        // console.log(data);
        this.technicians = data;
      },
      error: (err) => console.error(err),
    });
  }

  onSubmit() {
    // console.log(this.client);
    this.tool_output.tool_id = this.tool_output.tool.id;
    this.tool_output.technician_id = this.tool_output.technician.id;
    // delete this.tool_output.tool;
    delete this.tool_output.technician;
    if (this.isAddForm) {
      this.toolService.saveToolOutput(this.tool_output).subscribe({
        next: (data) => {
          // console.log(data.status);
          if (data.status == 201) {
            this.tool_output.tool.stock_level -= this.tool_output.quantity;
            this.toolService.updateTool(this.tool_output.tool).subscribe({
              next: (data) => {
                // console.log(data);
                if (data.status == 206) {
                  // Handle the response from the server
                  M.toast({
                    html: "Data created successfully....",
                    classes: "rounded green accent-4",
                    inDuration: 500,
                    outDuration: 575,
                  });
                  // this.loadItems();
                  this.router.navigate(["release/list"]);
                }
              },
              error: (err) => console.error(err),
            });
          }
        },
        error: (err) => console.error(err),
      });
    } else {
      console.log(this.tool_output);
      // this.toolService.updateToolOutput(this.tool_output).subscribe({
      //   next: (data) => {
      //     // console.log(data);
      //     if (data.status == 206) {
      //       // Handle the response from the server
      //       M.toast({
      //         html: "Data updated successfully....",
      //         classes: "rounded green accent-4",
      //         inDuration: 500,
      //         outDuration: 575,
      //       });
      //       // this.loadItems();
      //       this.router.navigate(["/tools/list"]);
      //     }
      //   },
      //   error: (err) => console.error(err),
      // });
    }
  }
}
