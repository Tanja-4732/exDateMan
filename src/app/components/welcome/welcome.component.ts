import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { InventoryService } from "../../services/inventory/inventory.service";

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

  constructor(private is: InventoryService) {}

  async ngOnInit(): Promise<void> {
    try {
      console.log(await this.is.getInventories());
      this.loggedIn = true;
    } catch (error) {
      this.loggedIn = false;
    }
  }
}
