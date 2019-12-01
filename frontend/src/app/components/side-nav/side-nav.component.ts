import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  GetStatusResponse
} from "../../services/auth/auth.service";

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"]
})
export class SideNavComponent implements OnInit {
  /**
   * A flag set while the component is loading its data
   */
  loading = true;

  /**
   * The user, cached here
   */
  authStatus: GetStatusResponse = {} as GetStatusResponse;

  constructor(private as: AuthService) {}

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
}
