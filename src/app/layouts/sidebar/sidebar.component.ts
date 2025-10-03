import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-sidebar",
  imports: [CommonModule],
  standalone: true,
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  user: any | undefined;
  activeLink: any = "";
  @Input() submenus: any[] | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute // private location: Location
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activeLink = this.router.url;
    // console.log(this.activeLink);
  }
}
