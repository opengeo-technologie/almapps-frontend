import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../../services/product.service";
import { Router } from "@angular/router";
import { ToolsService } from "../../../services/tools.service";
declare var M: any;

@Component({
  selector: "app-form-tool",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./form-tool.component.html",
  styleUrl: "./form-tool.component.css",
})
export class FormToolComponent {
  @Input() tool: any;
  isAddForm: boolean;

  constructor(private toolService: ToolsService, private router: Router) {
    this.isAddForm = this.router.url.includes("add");
  }

  ngOnInit() {
    // console.log(this.client);
    // this.isClientInformation = true;
    // console.log(this.client);
  }

  onSubmit() {
    // console.log(this.client);
    if (this.isAddForm) {
      this.toolService.saveTool(this.tool).subscribe({
        next: (data) => {
          // console.log(data.status);
          if (data.status == 201) {
            // Handle the response from the server
            M.toast({
              html: "Data created successfully....",
              classes: "rounded green accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            // this.loadItems();
            this.router.navigate(["/tools/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    } else {
      this.toolService.updateTool(this.tool).subscribe({
        next: (data) => {
          // console.log(data);
          if (data.status == 206) {
            // Handle the response from the server
            M.toast({
              html: "Data updated successfully....",
              classes: "rounded green accent-4",
              inDuration: 500,
              outDuration: 575,
            });
            // this.loadItems();
            this.router.navigate(["/tools/list"]);
          }
        },
        error: (err) => console.error(err),
      });
    }
  }
}
