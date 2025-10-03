import { Component } from "@angular/core";
import { NavbarComponent } from "../../layouts/navbar/navbar.component";
import { MainBoardComponent } from "../../layouts/main-board/main-board.component";

@Component({
  selector: "app-menu-list",
  imports: [NavbarComponent, MainBoardComponent],
  standalone: true,
  templateUrl: "./menu-list.component.html",
  styleUrl: "./menu-list.component.css",
})
export class MenuListComponent {}
