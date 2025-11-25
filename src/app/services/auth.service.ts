import { Injectable } from "@angular/core";
import { APP_CONSTANTS } from "../constants/app.constants";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = APP_CONSTANTS.API_BASE_URL;
  private tokenKey = "access_token";
  private userData = "user";
  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  private headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    const credidential = {
      username: username,
      password: password,
    };

    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, credidential, {
        headers: this.headers,
      })
      .pipe(
        tap((res) => {
          // console.log(res.user);
          if (this.isBrowser()) {
            localStorage.setItem(this.userData, JSON.stringify(res.user));
            localStorage.setItem(this.tokenKey, res.access_token);
            this.isLoggedIn$.next(true);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.clear();
    this.isLoggedIn$.next(false);
    this.router.navigate(["/login"]);

    // if (this.isBrowser()) {
    //   localStorage.removeItem(this.tokenKey);
    //   // this.isLoggedIn$.next(false);
    //   this.router.navigate(["/login"]);
    // }
  }

  getUser() {
    if (this.isBrowser()) {
      return localStorage.getItem(this.userData);
    }
    return null;
  }

  getToken() {
    if (this.isBrowser()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private hasToken(): boolean {
    if (this.isBrowser()) {
      return !!localStorage.getItem(this.tokenKey);
    }
    return false;
  }
}
