import { Component, Input } from "@angular/core";
import { NavbarComponent } from "../../layouts/navbar/navbar.component";
import { SidebarComponent } from "../../layouts/sidebar/sidebar.component";

@Component({
  selector: "app-base",
  imports: [NavbarComponent, SidebarComponent],
  standalone: true,
  templateUrl: "./base.component.html",
  styleUrl: "./base.component.css",
})
export class BaseComponent {
  @Input() submenus: any[] | undefined;
}
