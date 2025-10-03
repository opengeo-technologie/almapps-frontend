import { Component } from "@angular/core";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-dashboard",
  imports: [BaseComponent],
  standalone: true,
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {}
