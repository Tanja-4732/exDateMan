import { Component, OnInit } from "@angular/core";
import { AuthService, GetStatusResponse } from "./services/auth/auth.service";
import { InventoryService } from "./services/inventory/inventory.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  /**
   * The title of the application
   */
  title = "Expiration date manager";

  get sideNavOpened(): boolean {
    switch (window.localStorage.getItem("sideNavOpened")) {
      case "true":
        return true;
      case "false":
        return false;
      case null:
        this.sideNavOpened = true;
        return true;
    }
  }

  set sideNavOpened(value: boolean) {
    window.localStorage.setItem("sideNavOpened", value + "");
  }

  /**
   * If the authentication status is currently being checked
   */
  loading = true;

  /**
   * If the authentication token is invalid
   */
  invalidJWT = false;

  /**
   * The user, cached here
   */
  authStatus: GetStatusResponse = {} as GetStatusResponse;

  constructor(private as: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.testLogin();
    document.addEventListener("auth", () => this.testLogin());
  }

  /**
   * Tests if the user is logged in
   */
  async testLogin(): Promise<void> {
    const res = await this.as.getCurrentUser();

    this.authStatus = res;

    this.loading = false;
  }

  async onLogout(): Promise<void> {
    await this.logout();
  }

  async logout(): Promise<void> {
    try {
      await this.as.logout();

      this.router.navigate(["/welcome"]);
    } catch (error) {
      console.log(error);
    }

    // Reload the login status
    document.dispatchEvent(new Event("auth"));
  }
}
