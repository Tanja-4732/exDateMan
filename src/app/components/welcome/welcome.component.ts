import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { InventoryService } from "../../services/inventory/inventory.service";
import { User } from "../../models/user/user";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent implements OnInit {
  /**
   * If the user is logged in
   */
  loggedIn: boolean = true;
  loading: boolean = true;
  user: User;

  constructor(private as: AuthService) {}

  ngOnInit(): void {
    this.loading = true;
    this.testLogin().then();
  }

  async testLogin(): Promise<void> {
    try {
      this.user = await this.as.getUser();
      this.loggedIn = true;
    } catch (error) {
      this.loggedIn = false;
    }
    this.loading = false;
  }

  onLogout(): void {
    this.logout().then();
  }

  async logout(): Promise<void> {
    try {
      await this.as.logout();
      this.loggedIn = false;
    } catch (error) {
      console.log(error);
    }
  }
}
