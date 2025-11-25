// auth.guard.ts
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  // const authService = inject(AuthService);
  // const router = inject(Router);

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const token = this.authService.getToken();

    if (!this.authService.getToken()) {
      this.router.navigate(["/login"]);
      return false;
    }
    return true;
  }

  // if (authService.getToken()) {
  //   return true;
  // } else {
  //   // router.navigate(["/login"]);
  //   return false;
  // }
}
