import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService, LoginResponse } from "../../services/auth/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  // true, when the login data was incorrect
  oof: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    this.email = this.route.snapshot.params["email"];
  }

  ngOnInit() {
    // try {
    //   this.router.navigate(["/inventories"]);
    // } catch (err) {
    //   this.oof = true;
    // }
  }

  async onLogin(): Promise<void> {
    this.auth
      .login(this.email, this.password)
      .then((response: LoginResponse) => {
        if (response.status === 200) {
          this.oof = false;
          this.router.navigate(["/inventories"]);
        } else {
          this.oof = true;
        }
      })
      .catch(() => {
        this.oof = true;
      });
  }
}
