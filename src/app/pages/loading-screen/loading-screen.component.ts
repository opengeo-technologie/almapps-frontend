import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-loading-screen",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./loading-screen.component.html",
  styles: ``,
})
export class LoadingScreenComponent {
  @Input() message: string | undefined;
}
